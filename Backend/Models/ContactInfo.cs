using System.ComponentModel.DataAnnotations;

namespace FormBackend.Models
{
    public class ContactInfo
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [Phone]
        public string PrimaryMobile { get; set; }
        [Phone]
        public string? AlternateMobile { get; set; }
        [Required]
        [EmailAddress]
        public string PrimaryEmail { get; set; }
        [EmailAddress]
        public string? AlternateEmail { get; set; }
    }
}
