using System;
using System.ComponentModel.DataAnnotations;

namespace MySafeNote.Core
{
    public class Notebook : BaseEntity
    {
        [Required]
        [StringLength(256, ErrorMessage = "Поле не может быть более 256 символов.")]
        public string Name { get; set; }
        public int UserId { get; set; }
        public virtual User User { get; set; }
    }
}
