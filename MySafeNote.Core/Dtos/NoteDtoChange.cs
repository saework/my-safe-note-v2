using System;

//namespace MySafeNote.WebHost.Model
namespace MySafeNote.Core.Dtos
{
    public class NoteDtoChange
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public int? NotebookId { get; set; }
        public string? NotebookName { get; set; }
        public string? NotePasswordHash { get; set; }
        public DateTime LastChangeDate { get; set; }
        public string? NoteBody { get; set; }
        public int UserId { get; set; }
    }
}
