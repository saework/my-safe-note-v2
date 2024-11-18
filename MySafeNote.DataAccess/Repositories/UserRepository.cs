using System.Threading.Tasks;
using MySafeNote.Core;
using MySafeNote.Core.Abstractions;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace MySafeNote.DataAccess.Repositories
{
    public class UserRepository : EfRepository<User>, IUserRepository
    {
        public UserRepository(DataContext context) : base(context)
        {
        }

        public async Task<bool> CheckUserExists(string email)
        {
            return await DbSet.AnyAsync(x => x.Email == email);
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await DbSet.FirstOrDefaultAsync(x => x.Email == email);
        }

        public async Task<int> GetUserIdByEmailAsync(string email)
        {
            var user = await DbSet.FirstOrDefaultAsync(x => x.Email == email);
            if (user != null)
                return user.Id;
            else
                return 0;
        }

    }
}
