using System;
using System.ComponentModel.DataAnnotations;

namespace FormBackend.DTOs
{
    public class AcademicEnrollmentDTO
    {
        [Required]
        public int FacultyId { get; set; }
        [Required]
        public required string ProgramName { get; set; }
        [Required]
        public DateTime EnrollmentDate { get; set; }
        public string? StudentIdNumber { get; set; }
    }
}
