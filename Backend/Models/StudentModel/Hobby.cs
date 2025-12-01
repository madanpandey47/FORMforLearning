using System.ComponentModel.DataAnnotations;

namespace FormBackend.Models
{
    public class Hobby
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}
