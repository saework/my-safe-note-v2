using System;
using System.Collections.Generic;
using System.Text;
using MySafeNote.Core;

namespace MySafeNote.DataAccess.Data
{
    public static class FakeDataFactory
    {
        public static IEnumerable<User> Users => new List<User>()
        {
            //new User()
            //{
            //    Id = 1,
            //    Email = "test@test.ru",
            //    PasswordHash = ""
            //}
        };
        public static IEnumerable<Notebook> Notebooks => new List<Notebook>()
        {
            //new Notebook()
            //{
            //    Id = 1,
            //    Name = "Блокнот 1",
            //    UserId = 1
            //}
        };
        public static IEnumerable<Note> Notes => new List<Note>()
        {
            //new Note()
            //{
            //    Id = 1,
            //    Title = "Заметка 1 пользователя 1",
            //    NotebookId = 1,
            //    NotePasswordHash = "",
            //    CreateDate = DateTime.Now,
            //    LastChangeDate = DateTime.Now,
            //    NoteBody = "<p>Текст</p>",
            //    UserId = 1
            //}
        };
    }
}
