using System.ComponentModel.DataAnnotations;

namespace FormBackend.Models
{
    public class SecondaryInfos
    {
        [Key]
        public int Id { get; set; }

        public string? MiddleName { get; set; }
        [Phone]
        public string? AlternateMobile { get; set; }
        [EmailAddress]
        public string? AlternateEmail { get; set; }
        public string? AcademicCertificatePaths { get; set; }
    }
}
