using System.ComponentModel.DataAnnotations;

namespace FormBackend.Models
{
    public class FacultyMember
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Position { get; set; } // e.g., "Professor", "Associate Professor"
        [Required]
        public int FacultyId { get; set; }
        public virtual Faculty Faculty { get; set; }
    }
}
