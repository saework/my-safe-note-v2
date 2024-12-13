using System;

namespace MySafeNote.WebHost.Model
{
    public class NoteDtoChange
    {
        public int Id { get; set; }
        //public int Number { get; set; }
        public required string Title { get; set; }
        public Guid BodyLink { get; set; }
        public string? NotePassword { get; set; }
        public DateTime LastChangeDate { get; set; }
        public int UserId { get; set; }
    }
}
