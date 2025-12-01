using System.ComponentModel.DataAnnotations;

namespace FormBackend.Models
{
    public class FacultyMember
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public required string Name { get; set; }
        [Required]
        public required string Position { get; set; } // e.g., "Professor", "Associate Professor"
        [Required]
        public int FacultyId { get; set; }
        public virtual Faculty? Faculty { get; set; }
    }
}
