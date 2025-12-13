using FormBackend.Core.Interfaces;
using FormBackend.DTOs;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using AutoMapper;

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
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateStudent([FromForm] CreateStudentDTO createStudentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdStudent = await _studentService.CreateStudentAsync(createStudentDto);
            return CreatedAtAction(nameof(GetStudent), new { pid = createdStudent.PID }, createdStudent);
        }

        [HttpGet("{pid:guid}")]
        public async Task<IActionResult> GetStudent(Guid pid)
        {
            var studentDto = await _studentService.GetStudentByPIDAsync(pid);
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

        [HttpPut("{pid:guid}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateStudent(Guid pid, [FromForm] UpdateStudentDTO updateStudentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            // Ensure the PID from the route matches the one in the body if it exists
            if (updateStudentDto.PID != Guid.Empty && pid != updateStudentDto.PID)
            {
                return BadRequest("PID in route does not match PID in body.");
            }
            updateStudentDto.PID = pid; // Ensure the DTO has the correct PID from the route

            try
            {
                var updatedStudent = await _studentService.UpdateStudentAsync(pid, updateStudentDto);
                if (updatedStudent == null)
                {
                    return NotFound();
                }
                return Ok(updatedStudent);
            }
            catch (Exception ex)
            {
                // TODO: Log the exception details using a proper logger (e.g., ILogger<StudentController>)
                return StatusCode(500, "An internal server error occurred while updating the student.");
            }
        }

        [HttpDelete("{pid:guid}")]
        public async Task<IActionResult> DeleteStudent(Guid pid)
        {
            var result = await _studentService.DeleteStudentAsync(pid);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}