using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FormBackend.Models
{
    public class AcademicEnrollment : BaseIdEntity
    {

        [Required]
        public Guid StudentPID { get; set; }
        public virtual Student? Student { get; set; }

        [Required]
        public int FacultyId { get; set; }
        public virtual Faculty? Faculty { get; set; }

        [Required]
        public required string ProgramName { get; set; }

        [Required]
        public DateTime EnrollmentDate { get; set; }

        public string? StudentIdNumber { get; set; }
    }
}
