using FormBackend.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace FormBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LookupsController : ControllerBase
    {
        private readonly ILookupService _lookupService;

        public LookupsController(ILookupService lookupService)
        {
            _lookupService = lookupService;
        }

        [HttpGet("blood-types")]
        public async Task<IActionResult> GetBloodTypes()
        {
            var bloodTypes = await _lookupService.GetBloodTypes();
            return Ok(bloodTypes);
        }

        [HttpGet("academic-levels")]
        public async Task<IActionResult> GetAcademicLevels()
        {
            var academicLevels = await _lookupService.GetAcademicLevels();
            return Ok(academicLevels);
        }

        [HttpGet("genders")]
        public async Task<IActionResult> GetGenders()
        {
            var genders = await _lookupService.GetGenders();
            return Ok(genders);
        }

        [HttpGet("parent-types")]
        public async Task<IActionResult> GetParentTypes()
        {
            var parentTypes = await _lookupService.GetParentTypes();
            return Ok(parentTypes);
        }

        [HttpGet("faculty-types")]
        public async Task<IActionResult> GetFacultyTypes()
        {
            var facultyTypes = await _lookupService.GetFacultyTypes();
            return Ok(facultyTypes);
        }

        [HttpGet("provinces")]
        public async Task<IActionResult> GetProvinces()
        {
            var provinces = await _lookupService.GetProvinces();
            return Ok(provinces);
        }

        [HttpGet("districts/{province}")]
        public async Task<IActionResult> GetDistricts(string province)
        {
            var districts = await _lookupService.GetDistricts(province);
            return Ok(districts);
        }
    }
}
