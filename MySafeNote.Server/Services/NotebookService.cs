using MySafeNote.Core.Abstractions;
using MySafeNote.Core;
//using MySafeNote.Server.Model;
//using static MySafeNote.Server.Services.NotebookService;
using MySafeNote.Core.Dtos;

namespace MySafeNote.Server.Services
{
        public class NotebookService : INotebookService
        {
            private readonly INotebookRepository _notebookRepository;
            private readonly IUserRepository _userRepository;
            private readonly ILogger<NotebookService> _logger;

            public NotebookService(INotebookRepository notebookRepository, IUserRepository userRepository, ILogger<NotebookService> logger)
            {
                _notebookRepository = notebookRepository;
                _userRepository = userRepository;
                _logger = logger;
            }

            public async Task<List<NotebookDto>> GetNotebooksByUserIdAsync(int userId)
            {
                //_logger.LogInformation("GetNotebooksByUserIdAsync userId = {userId}", userId);
                var notebooks = await _notebookRepository.GetNotebooksByUserIdAsync(userId);
                return notebooks.Select(x => new NotebookDto
                {
                    Id = x.Id,
                    Name = x.Name
                }).ToList();
            }

            public async Task<int> CreateOrUpdateNotebookAsync(Notebook notebookDto)
            {
                if (notebookDto == null)
                {
                    //throw new ArgumentException("Некорректные данные.");
                    throw new ArgumentException("Incorrect notebookDto data.");
                }

                var user = await _userRepository.GetByIdAsync(notebookDto.UserId);
                if (user == null)
                {
                    //throw new ArgumentException($"Пользователя с ИД: {notebookDto.UserId} не существует.");
                    throw new ArgumentException($"User with ID: {notebookDto.UserId} not found.");
                }

                if (notebookDto.Id == 0) // Создаем новый блокнот
                {
                    var newNotebook = new Notebook
                    {
                        Name = notebookDto.Name,
                        UserId = notebookDto.UserId,
                        //User = user
                    };
                    return await _notebookRepository.CreateAsync(newNotebook);
                }
                else // Обновляем данные заметки
                {
                    var notebook = await _notebookRepository.GetByIdAsync(notebookDto.Id);

                    //notebook = null; //!!!убрать!!

                    if (notebook == null)
                    {
                    //throw new ArgumentException($"Notebook с ID: {notebookDto.Id} не найден.");
                    throw new ArgumentException($"Notebook with ID: {notebookDto.Id} not found.");
                }

                    notebook.Name = notebookDto.Name;
                    await _notebookRepository.UpdateAsync(notebook);
                    return notebook.Id;
                }
            }

            public async Task<int> DeleteNotebookByIdAsync(int id)
            {
                var deletedId = await _notebookRepository.RemoveAsync(id);
                return deletedId;
        }
        }
}
