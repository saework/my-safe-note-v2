using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MySafeNote.Core;
using MySafeNote.Core.Abstractions;
using MySafeNote.WebHost.Model;
using MySafeNote.DataAccess.Repositories;

namespace my_safe_note.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly INoteRepository _noteRepository;
        public UserController(IUserRepository userRepository, INoteRepository noteRepository)
        {
            _userRepository = userRepository;
            _noteRepository = noteRepository;
        }

        // GET: api/User
        [HttpGet]
        public async Task<ActionResult<List<User>>> GetUsersAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return Ok(users);
        }

        // GET api/User/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserByIdAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound($"User с ID: {id} не найден.");
            }
            return Ok(user);
        }

        // GET api/User/email/{email}
        [HttpGet("email/{email}")]
        public async Task<ActionResult<User>> GetUserByEmailAsync(string email)
        {
            var user = await _userRepository.GetUserByEmailAsync(email);
            if (user == null)
            {
                return NotFound($"User с Email: {email} не найден.");
            }
            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateUserAsync([FromBody] UserDto userDto)
        {
            // Проверяем, что данные в данные валидны
            if (userDto == null || string.IsNullOrEmpty(userDto.Email) || string.IsNullOrEmpty(userDto.Password))
            {
                return BadRequest("Некорректные данные.");
            }
            var userExists = await _userRepository.CheckUserExists(userDto.Email.Trim());
            if (userExists)
            {
                return NotFound($"User с Email: {userDto.Email} уже создан.");
            }
            try
            {
                var passwordHash = Services.HashPassword(userDto.Password);
                var newUser = new User { Email = userDto.Email, PasswordHash = passwordHash };
                var newUserId = await _userRepository.CreateAsync(newUser);
                return CreatedAtAction(nameof(GetUserByIdAsync), new { id = newUserId }, newUserId);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Внутренняя ошибка сервера. {ex.Message}");
            }
        }

        // PUT api/User/5
        [HttpPut("{id}")]
        public async Task<ActionResult<User>> ChangeUserByIdAsync(int id, [FromBody] UserDto changedUser)
        {
            if (changedUser is null)
            {
                return BadRequest("updatedUser пустой");
            }
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                return BadRequest($"User с ID: {id} не найден.");
            }
            // Обновляем данные пользователя
            user.Email = changedUser.Email;
            var passwordHash = Services.HashPassword(changedUser.Password);
            user.PasswordHash = passwordHash;
            await _userRepository.UpdateAsync(user);
            return Ok(user);
        }

        // DELETE api/User/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<int>> DeleteUserByIdAsync(int id)
        {
            var deletedId = await _userRepository.RemoveAsync(id);
            return Ok(deletedId);
        }

        // DELETE api/User/email/{email}
        [HttpDelete("email/{email}")]
        public async Task<ActionResult<int>> DeleteUserByEmailAsync(string email)
        {
            var user = await _userRepository.GetUserByEmailAsync(email);
            if (user == null)
            {
                return NotFound($"User с Email: {email} не найден.");
            }
            var deleteUserNotes = await _noteRepository.DeleteAllNotesByUserEmailAsync(email);
            var deletedId = await _userRepository.RemoveAsync(user.Id);
            if (deleteUserNotes == 0 || deletedId == 0)
                return Ok(0);
            else
                return Ok(deletedId);
        }
    }
}

