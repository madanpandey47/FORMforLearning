using FormBackend.Core.Interfaces;
using FormBackend.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace FormBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentController : ControllerBase
    {
        private readonly IStudentService _service;

        public StudentController(IStudentService service)
        {
            _service = service;
        }

        [HttpGet("lookup")]
        public async Task<IActionResult> GetAllLookup()
        {
            var students = await _service.GetAllLookupAsync();
            return Ok(students);
        }

        [HttpGet("{pid:guid}")]
        public async Task<IActionResult> GetById(Guid pid)
        {
            var student = await _service.GetByIdAsync(pid);
            if (student == null) return NotFound();
            return Ok(student);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreateStudentDTO studentDto)
        {
            var success = await _service.CreateAsync(studentDto);
            if (!success) return BadRequest("Failed to create student");
            return Ok(new { message = "Student created successfully" });
        }

        [HttpPut("{pid:guid}")]
        public async Task<IActionResult> Update(Guid pid, [FromForm] UpdateStudentDTO studentDto)
        {
            var success = await _service.UpdateAsync(pid, studentDto);
            if (!success) return NotFound();
            var updatedStudent = await _service.GetByIdAsync(pid);
            return Ok(updatedStudent);
        }


        [HttpDelete("{pid:guid}")]
        public async Task<IActionResult> Delete(Guid pid)
        {
            var success = await _service.DeleteAsync(pid);
            return success ? NoContent() : NotFound();
        }
    }
}