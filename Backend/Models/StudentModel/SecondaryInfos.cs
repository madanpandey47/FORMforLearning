using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FormBackend.Models
{
    public class SecondaryInfos : BaseEntity
    {
        public string? MiddleName { get; set; }
        [Phone]
        public string? AlternateMobile { get; set; }
        [EmailAddress]
        public string? AlternateEmail { get; set; }
        public string? AcademicCertificatePaths { get; set; }

        [ForeignKey("Student")]
        public Guid StudentPID { get; set; }
        public virtual Student? Student { get; set; }
    }
}
