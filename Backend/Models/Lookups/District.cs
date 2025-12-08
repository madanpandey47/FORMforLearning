using System;
using System.ComponentModel.DataAnnotations;

namespace FormBackend.Models.Lookups
{
    public class District
    {
        public int Id { get; set; }
        [Required]
        public required int ProvinceId { get; set; }
        [Required]
        public required string Name { get; set; }
    }
}