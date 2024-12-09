namespace MySafeNote.Server.Model
{
    public class NoteDtoGet
    {
        public int Id { get; set; }
        public string Title { get; set; }
        //public string NotePassword { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime LastChangeDate { get; set; }
        //public int UserId { get; set; }
    }
}
