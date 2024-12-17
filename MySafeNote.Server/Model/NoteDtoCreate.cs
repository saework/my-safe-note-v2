using System;

namespace MySafeNote.WebHost.Model
{
    public class NoteDtoCreate 
        //HACK Вместо этого класса использовать класс NoteDto
    {
        public required string Title { get; set; }
        public string? Notebook { get; set; }
        public string? NotePassword { get; set; }
        public DateTime CreateDate { get; set; }
        public string? NoteBody { get; set; }
        public int UserId { get; set; }
    }
}

