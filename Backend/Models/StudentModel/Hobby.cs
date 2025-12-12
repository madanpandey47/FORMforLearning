using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FormBackend.Models
{
    public class Hobby : BaseEntity
    {
        public string Name { get; set; } = string.Empty;

        // Foreign Key to Student
        [ForeignKey("Student")]
        public Guid StudentPID { get; set; }
        public virtual Student? Student { get; set; }
    }
}
