using Microsoft.EntityFrameworkCore;
using MySafeNote.Core;
using MySafeNote.DataAccess.EntityConfigurations;

namespace MySafeNote.DataAccess
{
    public class DataContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Note> Notes { get; set; }

        public DataContext(DbContextOptions<DataContext> options)
            : base(options)
        {
            Database.EnsureCreated(); // Создаем базу данных при первом обращении
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new UserEntityConfiguration());
            modelBuilder.ApplyConfiguration(new NoteEntityConfiguration());

            base.OnModelCreating(modelBuilder);
        }
    }
}