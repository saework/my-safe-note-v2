using System;
using System.Reflection.Emit;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MySafeNote.Core;

namespace MySafeNote.DataAccess.EntityConfigurations
{
    public class UserEntityConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            //builder.ToTable("Users");
            //builder.HasKey(r => r.Id);
            ////builder.HasIndex(r => r.Email);
            //builder.Property(r => r.Email).IsRequired().HasMaxLength(256);


            //builder.ToTable("Users");
            //builder.HasKey(r => r.Id);
            //builder.Property(r => r.Email).IsRequired().HasMaxLength(256);

            //builder.HasMany(r => r.Notebooks)
            //       .WithOne(t => t.User)
            //       .HasForeignKey(t => t.UserId);

            //builder.HasMany(r => r.Notes)
            //       .WithOne(t => t.User)
            //       .HasForeignKey(t => t.UserId);


            builder.ToTable("Users");
            builder.HasKey(r => r.Id);
            //builder.HasIndex(r => r.Email);

            //builder.HasMany(u => u.Notebooks)
            //   .WithOne(n => n.User)
            //   .HasForeignKey(n => n.UserId)
            //   .OnDelete(DeleteBehavior.Cascade);

            //builder.HasMany(u => u.Notes)
            //    .WithOne(n => n.User)
            //    .HasForeignKey(n => n.UserId)
            //    .OnDelete(DeleteBehavior.Cascade);
        }
    }
}