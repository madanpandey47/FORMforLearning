using System;
using System.ComponentModel.DataAnnotations;

namespace FormBackend.Models.Lookups
{
    public class Province
    {
        public required int Id { get; set; }
        [Required]
        public required string Name { get; set; }
    }
}