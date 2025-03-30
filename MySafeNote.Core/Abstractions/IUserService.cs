using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MySafeNote.Core;
using MySafeNote.Core.Dtos;

namespace MySafeNote.Core.Abstractions
{
    public interface IUserService
    {
        //Task <UserLoginDto> CreateJwtToken(int userId, string email);
        UserLoginDto CreateJwtToken(int userId, string email);
        Task<List<User>> GetAllUsersAsync();
        Task<User> GetUserByIdAsync(int id);
        Task<User> GetUserByEmailAsync(string email);
        Task<int> CreateUserAsync(UserDto userDto);
        Task<User> UpdateUserAsync(int id, UserDto changedUser);
        Task<int> DeleteUserByIdAsync(int id);
        Task<int> DeleteUserByEmailAsync(string email);
        bool VerifyPassword(User user, string password);
    }
}