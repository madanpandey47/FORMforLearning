using System;
using System.ComponentModel.DataAnnotations;

namespace FormBackend.Models
{
    public class Scholarship
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public required string ScholarshipName { get; set; }
        public decimal? Amount { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
