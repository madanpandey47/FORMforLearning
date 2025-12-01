using System.ComponentModel.DataAnnotations;
using System;

namespace FormBackend.Models
{
    public class Achievement
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime? DateOfAchievement { get; set; }
    }
}
