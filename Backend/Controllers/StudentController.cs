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

        // [HttpGet]
        // public async Task<IActionResult> GetAll()
        // {
        //     var students = await _service.GetAllAsync();
        //     return Ok(students);
        // }

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
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Create([FromForm] CreateStudentDTO studentDto)
        {
            var student = await _service.CreateAsync(studentDto);
            return CreatedAtAction(nameof(GetById), new { pid = student.PID }, student);
        }

        [HttpPut("{pid:guid}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Update(Guid pid, [FromForm] UpdateStudentDTO studentDto)
        {
            var success = await _service.UpdateAsync(pid, studentDto);
            return success ? Ok() : NotFound();
        }

        [HttpDelete("{pid:guid}")]
        public async Task<IActionResult> Delete(Guid pid)
        {
            var success = await _service.DeleteAsync(pid);
            return success ? NoContent() : NotFound();
        }
    }
}