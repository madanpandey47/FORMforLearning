using System.ComponentModel.DataAnnotations;
using FormBackend.Models.Enum;

namespace FormBackend.DTOs
{
    public class ParentDTO
    {
        [Required]
        public required string FirstName { get; set; }
        public string? MiddleName { get; set; }
        [Required]
        public required string LastName { get; set; }
        [Required]
        public required ParentType Relation { get; set; }
        public string? Occupation { get; set; }
        public decimal? AnnualIncome { get; set; }
        [Phone]
        public string? MobileNumber { get; set; }
        [EmailAddress]
        public string? Email { get; set; }
    }
}
