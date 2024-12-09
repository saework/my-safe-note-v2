using System;

namespace MySafeNote.Core
{
    public class Note : BaseEntity
    {
        // public int Number { get; set; }
        public string Title { get; set; }
        public Guid BodyLink { get; set; }
        public string NotePasswordHash { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime LastChangeDate { get; set; }
        public byte[] NoteBody { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }


    }
}