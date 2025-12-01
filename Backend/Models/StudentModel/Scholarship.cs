using System;
using System.ComponentModel.DataAnnotations;

namespace FormBackend.Models
{
    public class Scholarship
    {
        [Key]
        public int Id { get; set; }
        public string ScholarshipName { get; set; } = string.Empty;
        public decimal? Amount { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
