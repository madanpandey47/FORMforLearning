using FormBackend.Core.Interfaces;
using FormBackend.DTOs;
using Microsoft.AspNetCore.Mvc;
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
        public async Task<IActionResult> CreateStudent([FromBody] StudentDTO studentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var createdStudentDto = await _studentService.CreateStudentAsync(studentDto);
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
    }
}
