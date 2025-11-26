using FormBackend.Core.Interfaces;
using FormBackend.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace FormBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicationFormController : ControllerBase
    {
        private readonly IApplicationFormService _applicationFormService;

        public ApplicationFormController(IApplicationFormService applicationFormService)
        {
            _applicationFormService = applicationFormService;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitApplication([FromBody] ApplicationFormDTO applicationFormDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var applicationForm = await _applicationFormService.CreateApplicationFormAsync(applicationFormDto);
            return CreatedAtAction(nameof(SubmitApplication), new { id = applicationForm.Id }, applicationForm);
        }
    }
}
