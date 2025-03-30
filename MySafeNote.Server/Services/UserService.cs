﻿using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
//using MySafeNote.Server.Model;
using Microsoft.AspNetCore.Identity;
using System.Text;
using MySafeNote.Server.Auth;
using Microsoft.IdentityModel.Tokens;
using MySafeNote.Core.Dtos;
using MySafeNote.Core.Abstractions;
using MySafeNote.Core;
using MySafeNote.Server.Controllers;
using Microsoft.Extensions.Logging;

namespace MySafeNote.Server.Services
{
    public class UserService : IUserService
    {

        private readonly IUserRepository _userRepository;
        private readonly INoteRepository _noteRepository;
        private readonly INotebookRepository _notebookRepository;
        private readonly PasswordHasher<User> _passwordHasher;
        private readonly ILogger<UserService> _logger;

        public UserService(ILogger<UserService> logger, IUserRepository userRepository, INoteRepository noteRepository, INotebookRepository notebookRepository)
        {
            _userRepository = userRepository;
            _noteRepository = noteRepository;
            _notebookRepository = notebookRepository;
            _passwordHasher = new PasswordHasher<User>();
            _logger = logger;
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _userRepository.GetAllAsync();
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _userRepository.GetByIdAsync(id);
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _userRepository.GetUserByEmailAsync(email);
        }

        public async Task<int> CreateUserAsync(UserDto userDto)
        {
            var passwordHash = _passwordHasher.HashPassword(new User { Email = userDto.Email }, userDto.Password);
            var newUser = new User { Email = userDto.Email, PasswordHash = passwordHash };
            var newUserId = await _userRepository.CreateAsync(newUser);
            return newUserId;
        }

        public async Task<User> UpdateUserAsync(int id, UserDto changedUser)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) throw new ArgumentException($"User с ID: {id} не найден.");

            user.Email = changedUser.Email;
            var passwordHash = _passwordHasher.HashPassword(user, changedUser.Password);
            user.PasswordHash = passwordHash;
            await _userRepository.UpdateAsync(user);
            return user;
        }

        public async Task<int> DeleteUserByIdAsync(int id)
        {
            return await _userRepository.RemoveAsync(id);
        }

        public async Task<int> DeleteUserByEmailAsync(string email)
        {
            var user = await _userRepository.GetUserByEmailAsync(email);
            if (user == null) throw new ArgumentException($"User с Email: {email} не найден.");

            var deleteUserNotes = await _noteRepository.DeleteAllNotesByUserEmailAsync(email);
            _logger.LogInformation("deleteUserNotes = {deleteUserNotes}", deleteUserNotes);
            var deleteUserNotebooks = await _notebookRepository.DeleteAllNotebooksByUserEmailAsync(email);
            _logger.LogInformation("deleteUserNotebooks = {deleteUserNotebooks}", deleteUserNotebooks);
            return await _userRepository.RemoveAsync(user.Id);
        }

        //public string CreateJwtToken(int userId, string email)
        //{
        //    // Реализуйте логику создания JWT токена
        //    return "JWT Token"; // Замените на реальную логику
        //}

        public bool VerifyPassword(User user, string password)
        {
            return _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password) == PasswordVerificationResult.Success;
        }

        //public static UserLoginDto CreateJwtToken(int userId, string email)
        //{
        //    var claims = new List<Claim> { new Claim(ClaimTypes.Name, email) };

        //    var jwt = new JwtSecurityToken(
        //        issuer: AuthOptions.ISSUER,
        //        audience: AuthOptions.AUDIENCE,
        //        claims: claims,
        //        expires: DateTime.UtcNow.Add(TimeSpan.FromMinutes(60)), // время жизни токена
        //        signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));

        //    var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

        //    var response = new UserLoginDto
        //    {
        //        AccessToken = encodedJwt,
        //        UserId = userId
        //    };
        //    return response;
        //}

        public UserLoginDto CreateJwtToken(int userId, string email)
        {
            var claims = new List<Claim> { new Claim(ClaimTypes.Name, email) };

            var jwt = new JwtSecurityToken(
                issuer: AuthOptions.ISSUER,
                audience: AuthOptions.AUDIENCE,
                claims: claims,
                expires: DateTime.UtcNow.Add(TimeSpan.FromMinutes(60)), // время жизни токена
                signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));

            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            var response = new UserLoginDto
            {
                AccessToken = encodedJwt,
                UserId = userId
            };
            return response;
        }
    }
}
