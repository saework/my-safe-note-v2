using System;

namespace MySafeNote.Core.Dtos
{
    public class NoteDtoGet
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public string? NotebookName { get; set; }
        public int? NotebookId { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime LastChangeDate { get; set; }
        public string? NoteBody { get; set; }
        public string? NotePasswordHash { get; set; }
        public int UserId { get; set; }
    }
}
