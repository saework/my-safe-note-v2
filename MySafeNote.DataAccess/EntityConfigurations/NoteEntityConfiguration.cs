using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MySafeNote.Core;

namespace MySafeNote.DataAccess.EntityConfigurations
{
    public class NoteEntityConfiguration : IEntityTypeConfiguration<Note>
    {
        public void Configure(EntityTypeBuilder<Note> builder)
        {
            builder.ToTable("Notes");
            builder.HasKey(r => r.Id);
            //builder.HasIndex(r => r.Number);
            builder.Property(r => r.Number).IsRequired();
            //builder.Property(r => r.CreateDate).IsRequired();
            //builder.Property(r => r.UserId).IsRequired();

            builder.HasOne(r => r.User)
                        .WithMany(t => t.Notes)
                        .HasForeignKey(r => r.UserId);

        }
    }
}
