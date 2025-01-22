using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MySafeNote.Core
{
    public class User : BaseEntity
    {
        //public string Email { get; set; }
        //public string PasswordHash { get; set; }
        ////public int UserRoleId { get; set; }
        //public List<Note> Notes { get; set; }
        //public List<Notebook> Notebooks { get; set; }


        //public User()
        //{
        //    Notes = new List<Note>();
        //    Notebooks = new List<Notebook>();
        //}

        //public string Email { get; set; }
        //public string PasswordHash { get; set; }
        //public List<Note> Notes { get; set; }
        //public List<Notebook> Notebooks { get; set; }


        //public string Email { get; set; }
        //public string PasswordHash { get; set; }


        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        //public virtual ICollection<Notebook> Notebooks { get; set; } = new List<Notebook>();
        //public virtual ICollection<Note> Notes { get; set; } = new List<Note>();
    }
}