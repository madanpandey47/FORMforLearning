using System.ComponentModel.DataAnnotations;

namespace FormBackend.Models
{
    public class BankDetails
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string BankName { get; set; }
        [Required]
        public string AccountNumber { get; set; }
        [Required]
        public string AccountHolderName { get; set; }
        public string? Branch { get; set; }
        public string? SwiftCode { get; set; }
    }
}
