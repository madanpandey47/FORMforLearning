using System;
using System.ComponentModel.DataAnnotations;

namespace FormBackend.Models
{
    public class Citizenship
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string CitizenshipNumber { get; set; }
        [Required]
        public string CountryOfIssuance { get; set; }
        [Required]
        public DateTime DateOfIssuance { get; set; }
        public string? PlaceOfIssuance { get; set; }
    }
}
