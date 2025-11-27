using System.ComponentModel.DataAnnotations;

namespace FormBackend.Models
{
    public class AddressType
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public required string Type { get; set; } // e.g., "Permanent", "Temporary"
    }
}
