using System.Threading.Tasks;

namespace MySafeNote.Core.Abstractions
{
    public interface IUserRepository : IRepository<User>
    {
        Task<bool> CheckUserExists(string email);
        Task<User> GetUserByEmailAsync(string email);
        Task<int> GetUserIdByEmailAsync(string email);
    }
}
