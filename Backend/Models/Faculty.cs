using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace FormBackend.Models
{
    public class Faculty
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } // e.g., "Faculty of Science", "Faculty of Arts"
        public string? Dean { get; set; }
        public virtual ICollection<FacultyMember> FacultyMembers { get; set; }
    }
}
