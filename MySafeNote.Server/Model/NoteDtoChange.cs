using System;

namespace MySafeNote.WebHost.Model
{
    public class NoteDtoChange
    {
        //HACK Вместо этого класса использовать класс NoteDto
        public int Id { get; set; }
        //public int Number { get; set; }
        public required string Title { get; set; }
        //public Guid BodyLink { get; set; }
        public string? Notebook { get; set; }
        public string? NotePasswordHash { get; set; }
        public DateTime LastChangeDate { get; set; }
        public string? NoteBody { get; set; }
        public int UserId { get; set; }
    }
}
