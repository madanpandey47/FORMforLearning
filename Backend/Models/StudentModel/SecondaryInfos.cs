using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FormBackend.Models
{
    public class SecondaryInfos
    {
        public string? MiddleName { get; set; }
        [Phone]
        public string? AlternateMobile { get; set; }
        [EmailAddress]
        public string? AlternateEmail { get; set; }
        public string? CitizenshipImagePath { get; set; }
        public string? BoardCertificateImagePath { get; set; }
        public string? StudentIdCardPath { get; set; }
        public string? AcademicCertificatePaths { get; set; }
    }
}
