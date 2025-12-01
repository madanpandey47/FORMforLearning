using System.ComponentModel.DataAnnotations;
using System;

namespace FormBackend.Models
{
    public class Achievement
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public required string Title { get; set; }
        public string? Description { get; set; }
        public DateTime? DateOfAchievement { get; set; }
    }
}
