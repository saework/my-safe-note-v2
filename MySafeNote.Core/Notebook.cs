using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySafeNote.Core
{
    public class Notebook : BaseEntity
    {
        public required string Name { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
