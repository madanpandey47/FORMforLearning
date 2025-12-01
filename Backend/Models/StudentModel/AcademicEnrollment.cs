using System;
using System.ComponentModel.DataAnnotations;

namespace FormBackend.Models
{
    public class AcademicEnrollment
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int StudentId { get; set; }
        public virtual Student? Student { get; set; }
        [Required]
        public int FacultyId { get; set; }
        public virtual Faculty? Faculty { get; set; }
        [Required]
        public required string ProgramName { get; set; }
        [Required]
        public DateTime EnrollmentDate { get; set; }
        public string? StudentIdNumber { get; set; } // The ID number given by the university
    }
}
