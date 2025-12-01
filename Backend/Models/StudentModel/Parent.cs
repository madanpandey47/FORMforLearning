using System.ComponentModel.DataAnnotations;

namespace FormBackend.Models
{
    public class Parent
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public required string FirstName { get; set; }
        public string? MiddleName { get; set; }
        [Required]
        public required string LastName { get; set; }
        [Required]
        public required string Relation { get; set; } // "Father", "Mother", "Guardian"
        public string? Occupation { get; set; }
        public decimal? AnnualIncome { get; set; }
        [Phone]
        public string? MobileNumber { get; set; }
        [EmailAddress]
        public string? Email { get; set; }
    }
}
