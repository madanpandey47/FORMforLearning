using System.ComponentModel.DataAnnotations;
using FormBackend.Models.Enum;

namespace FormBackend.DTOs
{
    public class FacultyDTO
    {
        public int Id { get; set; }

        [Required]
        public FacultyType Type { get; set; }

        [Required]
        public required string ProgramName { get; set; }
    }
}

