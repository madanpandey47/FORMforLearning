using System;
using System.ComponentModel.DataAnnotations;

namespace FormBackend.Models
{
    public abstract class BaseEntity
    {
        [Key]
        public Guid PID { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
