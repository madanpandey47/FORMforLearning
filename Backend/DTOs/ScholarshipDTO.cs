using System;

namespace FormBackend.DTOs
{
    public class ScholarshipDTO
    {
        public string? ScholarshipName { get; set; }
        public decimal? Amount { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
