using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using MySafeNote.Core;
using System;

namespace MySafeNote.DataAccess.EntityConfigurations
{
    public class NotebookEntityConfiguration : IEntityTypeConfiguration<Notebook>
    {
        public void Configure(EntityTypeBuilder<Notebook> builder)
        {
            builder.ToTable("Notebooks");
            builder.HasKey(r => r.Id);
            builder.HasIndex(r => r.Name);

            builder.HasOne(n => n.User)
                .WithMany()
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade); // Удаление пользователя приведет к удалению его блокнотов
        }
    }
}
