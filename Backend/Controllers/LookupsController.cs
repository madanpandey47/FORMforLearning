using FormBackend.Models.Enum;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace FormBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LookupsController : ControllerBase
    {
        private record OptionDto(int Value, string Name);

        [HttpGet("blood-types")]
        public IActionResult GetBloodTypes()
        {
            static string Label(BloodType bt) => bt switch
            {
                BloodType.APositive => "A+",
                BloodType.ANegative => "A-",
                BloodType.BPositive => "B+",
                BloodType.BNegative => "B-",
                BloodType.ABPositive => "AB+",
                BloodType.ABNegative => "AB-",
                BloodType.OPositive => "O+",
                BloodType.ONegative => "O-",
                _ => bt.ToString()
            };

            var values = (BloodType[])Enum.GetValues(typeof(BloodType));
            var list = new List<OptionDto>();
            foreach (var v in values)
            {
                list.Add(new OptionDto((int)v, Label(v)));
            }
            return Ok(list);
        }

        [HttpGet("academic-levels")]
        public IActionResult GetAcademicLevels()
        {
            var values = (AcademicLevel[])Enum.GetValues(typeof(AcademicLevel));
            var list = new List<OptionDto>();
            foreach (var v in values)
            {
                list.Add(new OptionDto((int)v, v.ToString()));
            }
            return Ok(list);
        }

        [HttpGet("address-types")]
        public IActionResult GetAddressTypes()
        {
            var values = (AddressType[])Enum.GetValues(typeof(AddressType));
            var list = new List<OptionDto>();
            foreach (var v in values)
            {
                list.Add(new OptionDto((int)v, v.ToString()));
            }
            return Ok(list);
        }

        [HttpGet("genders")]
        public IActionResult GetGenders()
        {
            var values = (Gender[])Enum.GetValues(typeof(Gender));
            var list = new List<OptionDto>();
            foreach (var v in values)
            {
                list.Add(new OptionDto((int)v, v.ToString()));
            }
            return Ok(list);
        }

        [HttpGet("parent-types")]
        public IActionResult GetParentTypes()
        {
            var values = (ParentType[])Enum.GetValues(typeof(ParentType));
            var list = new List<OptionDto>();
            foreach (var v in values)
            {
                list.Add(new OptionDto((int)v, v.ToString()));
            }
            return Ok(list);
        }
        [HttpGet("faculty-types")]
        public IActionResult GetFacultyTypes()
        {
            static string Label(FacultyType ft) => ft switch
            {
                FacultyType.Science => "Science",
                FacultyType.Commerce => "Commerce",
                FacultyType.Arts => "Arts",
                FacultyType.Engineering => "Engineering",
                FacultyType.Medicine => "Medicine",
                FacultyType.Law => "Law",
                FacultyType.Education => "Education",
                FacultyType.Management => "Management",
                FacultyType.IT => "IT",
                _ => ft.ToString()
            };

            var values = (FacultyType[])Enum.GetValues(typeof(FacultyType));
            var list = new List<OptionDto>();
            foreach (var v in values)
            {
                list.Add(new OptionDto((int)v, Label(v)));
            }
            return Ok(list);
        }
    }
}
