using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FormBackend.Models.Enum;

namespace FormBackend.Models
{
    public class Address
    {
        [Required]
        public required string Province { get; set; }
        [Required]
        public required string Municipality { get; set; }
        [Required]
        public required string Ward { get; set; }
        public string? Street { get; set; }
        [Required]
        public required string Country { get; set; }
        public AddressType Type { get; set; }
    }
}
