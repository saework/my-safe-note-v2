using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MySafeNote.Core
{
    public class User : BaseEntity
    {
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        //public int UserRoleId { get; set; }
        public List<Note> Notes { get; set; }
    }
}