using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FormBackend.Models
{
    public class Citizenship
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
