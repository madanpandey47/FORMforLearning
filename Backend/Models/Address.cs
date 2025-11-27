using System.ComponentModel.DataAnnotations;

namespace FormBackend.Models
{
    public class Address
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public required string Province { get; set; }
        [Required]
        public required string Municipality { get; set; }
        [Required]
        public required string Ward { get; set; }
        public string? Street { get; set; }
        [Required]
        public required string Country { get; set; }

        public int AddressTypeId { get; set; }
        
        public virtual AddressType? AddressType { get; set; }
    }
}
