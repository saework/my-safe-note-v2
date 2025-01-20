//#nullable enable
using System;

namespace MySafeNote.Core
{
    public class Note : BaseEntity
    {
        public required string Title { get; set; }
        //public string? Notebook { get; set; }
        public int? NotebookId { get; set; }
        public Notebook Notebook { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime LastChangeDate { get; set; }
        public string? NoteBody { get; set; }
        public string? NotePasswordHash { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }

    }
}