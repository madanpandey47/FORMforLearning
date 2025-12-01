using System.ComponentModel.DataAnnotations;

namespace FormBackend.Models
{
    public class FinancialDetails
    {
        [Key]
        public int Id { get; set; }
        public decimal? AnnualIncome { get; set; }
        public string? IncomeSource { get; set; }
        public bool? IsTaxPayer { get; set; }
        public string? PanNumber { get; set; }
    }
}
