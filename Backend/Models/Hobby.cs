using System.ComponentModel.DataAnnotations;

namespace FormBackend.Models
{
    public class Hobby
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public required string Name { get; set; }
    }
}
