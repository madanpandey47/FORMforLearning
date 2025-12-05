using System;
using System.ComponentModel.DataAnnotations;

namespace FormBackend.DTOs
{
    public class CitizenshipDTO
    {
        [Required]
        public required string CitizenshipNumber { get; set; }
        [Required]
        public required string CountryOfIssuance { get; set; }
        [Required]
        public DateTime DateOfIssuance { get; set; }
        public string? PlaceOfIssuance { get; set; }
    }
}
