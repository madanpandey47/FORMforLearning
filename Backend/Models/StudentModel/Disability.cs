using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FormBackend.Models
{
    public class Disability : BaseEntity
    {
        public string DisabilityType { get; set; } = string.Empty;
        public string? Description { get; set; }
        public double? DisabilityPercentage { get; set; }

        [ForeignKey("Student")]
        public Guid StudentPID { get; set; }
        public virtual Student? Student { get; set; }
    }
}
