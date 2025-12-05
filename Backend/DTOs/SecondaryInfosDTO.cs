using System.ComponentModel.DataAnnotations;

namespace FormBackend.DTOs
{
    public class SecondaryInfosDTO
    {
        public string? MiddleName { get; set; }
        [Phone]
        public string? AlternateMobile { get; set; }
        [EmailAddress]
        public string? AlternateEmail { get; set; }
        public string? Image { get; set; }
    }
}
