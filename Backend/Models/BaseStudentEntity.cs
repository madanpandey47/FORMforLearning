using System;
using System.ComponentModel.DataAnnotations;

namespace FormBackend.Models
{
    public abstract class BaseStudentEntity
    {
        [Key]
        public Guid PID { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
