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
            new User()
            {
                Id = 1,
                Email = "test@test.ru",
                PasswordHash = "111"
            },
            new User()
            {
                Id = 2,
                Email = "owner2@somemail.ru",
                PasswordHash = "gdhajlghaslfsfasfa"
            }
        };
        public static IEnumerable<Note> Notes => new List<Note>()
        {
            new Note()
            {
                Id = 1,
                // Number = 1,
                Title = "Заметка 1 пользователя 1",
                BodyLink = Guid.NewGuid(),
                NotePasswordHash = "",
                CreateDate = DateTime.Now,
                LastChangeDate = DateTime.Now,
                NoteBody = new byte[] { 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20 },
                UserId = 1
            },
            new Note()
            {
                Id = 2,
                // Number = 2,
                Title = "Заметка 2 пользователя 1",
                BodyLink = Guid.NewGuid(),
                NotePasswordHash = "",
                CreateDate = DateTime.Now,
                LastChangeDate = DateTime.Now,
                NoteBody = new byte[] { 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20 },
                UserId = 1
            },
            new Note()
            {
                Id = 3,
                // Number = 3,
                Title = "Заметка 1 пользователя 2",
                BodyLink = Guid.NewGuid(),
                NotePasswordHash = "",
                CreateDate = DateTime.Now,
                LastChangeDate = DateTime.Now,
                NoteBody = new byte[] { 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20 },
                UserId = 2
            },
            new Note()
            {
                Id = 4,
                // Number = 4,
                Title = "Заметка 2 пользователя 2",
                BodyLink = Guid.NewGuid(),
                NotePasswordHash = "",
                CreateDate = DateTime.Now,
                LastChangeDate = DateTime.Now,
                NoteBody = new byte[] { 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20 },
                UserId = 2
            }
        };
    }
}
