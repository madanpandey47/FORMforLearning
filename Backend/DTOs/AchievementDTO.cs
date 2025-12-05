using System;

namespace FormBackend.DTOs
{
    public class AchievementDTO
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime? DateOfAchievement { get; set; }
    }
}
