using System;
using System.Collections.Generic;
using System.Text;
using MySafeNote.DataAccess.Data;
using System.Linq;

namespace MySafeNote.DataAccess.Repositories
{
    public static class DbInitializer
    {
        public static async void Initialize(DataContext dbContext)
        {
            if (!dbContext.Users.Any() && !dbContext.Notes.Any())
            {
                await dbContext.Users.AddRangeAsync(FakeDataFactory.Users);
                await dbContext.Notes.AddRangeAsync(FakeDataFactory.Notes);
            }
            await dbContext.SaveChangesAsync();
        }
    }
}
