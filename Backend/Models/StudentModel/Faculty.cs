using System;
using System.ComponentModel.DataAnnotations;
using FormBackend.Models.Enum;

namespace FormBackend.Models
{
    public class Faculty : BaseIdEntity
    {
        [Required]
        public FacultyType Type { get; set; }
        [Required]
        public required string ProgramName { get; set; }
    }
}
