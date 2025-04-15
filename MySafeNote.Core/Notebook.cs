using System;
using System.ComponentModel.DataAnnotations;

namespace MySafeNote.Core
{
    public class Notebook : BaseEntity
    {
        [Required]
        [StringLength(256, ErrorMessage = "The field cannot be more than 256 characters.")]
        public string Name { get; set; }
        public int UserId { get; set; }
        public virtual User User { get; set; }
    }
}
