using System;

namespace MySafeNote.WebHost.Model
{
    public class NoteDtoCreate
    {
        //public int Number { get; set; }
        public string Title { get; set; }
        public Guid BodyLink { get; set; }
        public string NotePassword { get; set; }
        public DateTime CreateDate { get; set; }
        public int UserId { get; set; }
    }
}

