using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FormBackend.Models.Enum;

namespace FormBackend.Models
{
    public class AcademicEnrollment : BaseEntity
    {

        [Required]
        public Guid StudentPID { get; set; }
        public virtual Student? Student { get; set; }

        [Required]
        public  FacultyType Faculty { get; set; }
        [Required]
        public required string ProgramName { get; set; }
        [Required]
        public DateTime EnrollmentDate { get; set; }
        public string? StudentIdNumber { get; set; }
    }
}