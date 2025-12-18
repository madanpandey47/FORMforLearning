using FormBackend.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using System.Linq;
using FormBackend.Models.Enum;

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

        private IActionResult GetEnumAsList<T>() where T : Enum
        {
            var values = Enum.GetValues(typeof(T))
                .Cast<T>()
                .Select(e => new { value = Convert.ToInt32(e), name = e.ToString() });
            return Ok(values);
        }

        [HttpGet("blood-types")]
        public IActionResult GetBloodTypes() => GetEnumAsList<BloodType>();

        [HttpGet("academic-levels")]
        public IActionResult GetAcademicLevels() => GetEnumAsList<AcademicLevel>();


        [HttpGet("genders")]
        public IActionResult GetGenders() => GetEnumAsList<Gender>();

        [HttpGet("parent-types")]
        public IActionResult GetParentTypes() => GetEnumAsList<ParentType>();

        [HttpGet("faculty-types")]
        public IActionResult GetFacultyTypes() => GetEnumAsList<FacultyType>();

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
