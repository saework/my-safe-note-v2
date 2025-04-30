using System;
using System.ComponentModel.DataAnnotations;

namespace MySafeNote.Core
{
    public class User : BaseEntity
    {
        [Required]
        //[EmailAddress]
        public string Email { get; set; }
        [Required]
        public string PasswordHash { get; set; }
    }
}