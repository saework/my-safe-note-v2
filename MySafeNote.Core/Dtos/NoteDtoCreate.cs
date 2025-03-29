using System;

//namespace MySafeNote.WebHost.Model
namespace MySafeNote.Core.Dtos
{
    public class NoteDtoCreate 
    {
        public required string Title { get; set; }
        public int? NotebookId { get; set; }
        public string? NotePasswordHash { get; set; }
        public DateTime CreateDate { get; set; }
        public string? NoteBody { get; set; }
        public int UserId { get; set; }
    }
}

