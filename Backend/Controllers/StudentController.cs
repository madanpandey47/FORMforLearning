using FormBackend.Core.Interfaces;
using FormBackend.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Threading.Tasks;

namespace FormBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentController : ControllerBase
    {
        private readonly IStudentService _studentService;

        public StudentController(IStudentService studentService)
        {
            _studentService = studentService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateStudent()
        {
            try
            {
                // Get the studentDto JSON string from form data
                var studentDtoJson = Request.Form["studentDto"].ToString();
                
                if (string.IsNullOrEmpty(studentDtoJson))
                {
                    return BadRequest("studentDto field is required");
                }

                // Deserialize the JSON string to StudentDTO
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true  
                };
                
                var studentDto = JsonSerializer.Deserialize<StudentDTO>(studentDtoJson, options);
                
                if (studentDto == null)
                {
                    return BadRequest("Invalid studentDto format");
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var profileImage = Request.Form.Files.GetFile("profileImage");
                
                if (profileImage == null)
                {
                    return BadRequest(new { message = "Profile picture is required" });
                }

                var academicCertificates = Request.Form.Files.GetFiles("academicCertificates")?.ToList();

                var createdStudentDto = await _studentService.CreateStudentAsync(studentDto, profileImage, academicCertificates);
                if (createdStudentDto == null)
                {
                    return BadRequest("Student could not be created.");
                }
                return CreatedAtAction(nameof(GetStudent), new { id = createdStudentDto.Id }, createdStudentDto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the student", details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudent(int id)
        {
            var studentDto = await _studentService.GetStudentByIdAsync(id);
            if (studentDto == null)
            {
                return NotFound();
            }
            return Ok(studentDto);
        }

        [HttpGet]
        public async Task<IActionResult> GetStudents()
        {
            var studentDtos = await _studentService.GetAllStudentsAsync();
            return Ok(studentDtos);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id)
        {
            try
            {
                var studentDtoJson = Request.Form["studentDto"].ToString();

                if (string.IsNullOrEmpty(studentDtoJson))
                {
                    return BadRequest("studentDto field is required");
                }

                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };
                var studentDto = JsonSerializer.Deserialize<StudentDTO>(studentDtoJson, options);

                if (studentDto == null)
                {
                    return BadRequest("Invalid studentDto format");
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var profileImage = Request.Form.Files.GetFile("profileImage");
                
                // Validate that profile image is provided and mandatory
                if (profileImage == null)
                {
                    return BadRequest(new { message = "Profile picture is required" });
                }

                var academicCertificates = Request.Form.Files.GetFiles("academicCertificates")?.ToList();

                var updatedStudent = await _studentService.UpdateStudentAsync(id, studentDto, profileImage, academicCertificates);
                if (updatedStudent == null)
                {
                    return NotFound();
                }

                return Ok(updatedStudent);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the student", details = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            try
            {
                var result = await _studentService.DeleteStudentAsync(id);
                if (!result)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the student", details = ex.Message });
            }
        }
    }
}
