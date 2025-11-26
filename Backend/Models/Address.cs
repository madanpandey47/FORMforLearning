using System.ComponentModel.DataAnnotations;

namespace FormBackend.Models
{
    public class Address
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Province { get; set; }
        [Required]
        public string Municipality { get; set; }
        [Required]
        public string Ward { get; set; }
        public string? Street { get; set; }
        [Required]
        public string Country { get; set; }
    }
}
