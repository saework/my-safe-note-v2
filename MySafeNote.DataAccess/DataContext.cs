using Microsoft.EntityFrameworkCore;
using MySafeNote.Core;
using MySafeNote.DataAccess.EntityConfigurations;

namespace MySafeNote.DataAccess
{
    public class DataContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Note> Notes { get; set; }
        public DbSet<Notebook> Notebooks { get; set; }

        public DataContext(DbContextOptions<DataContext> options)
            : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new UserEntityConfiguration());
            modelBuilder.ApplyConfiguration(new NoteEntityConfiguration());
            modelBuilder.ApplyConfiguration(new NotebookEntityConfiguration());

            base.OnModelCreating(modelBuilder);
        }
    }
}