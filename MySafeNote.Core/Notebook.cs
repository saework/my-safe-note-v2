using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySafeNote.Core
{
    public class Notebook : BaseEntity
    {
        //public required string Name { get; set; }
        //public int UserId { get; set; }
        //public User User { get; set; }
        //public List<Note> Notes { get; set; }

        //public Notebook()
        //{
        //    Notes = new List<Note>();
        //}

        //public required string Name { get; set; }
        //public int UserId { get; set; }
        //public User User { get; set; }
        //public List<Note> Notes { get; set; }


        //public required string Name { get; set; }
        //public int UserId { get; set; }
        //public User User { get; set; }


        [Required]
        [StringLength(256, ErrorMessage = "Поле не может быть более 256 символов.")]
        public string Name { get; set; }

        public int UserId { get; set; }
        public virtual User User { get; set; }

        //public virtual ICollection<Note> Notes { get; set; } = new List<Note>();
    }
}
