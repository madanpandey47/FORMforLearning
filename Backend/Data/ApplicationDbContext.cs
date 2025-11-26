using FormBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace FormBackend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<ApplicationForm> ApplicationForms { get; set; }
        public DbSet<FamilyDetails> FamilyDetails { get; set; }
        public DbSet<AcademicDetails> AcademicDetails { get; set; }
        public DbSet<Address> Addresses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ApplicationForm>()
                .HasOne(a => a.PermanentAddress)
                .WithOne()
                .HasForeignKey<ApplicationForm>("PermanentAddressId")
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ApplicationForm>()
                .HasOne(a => a.TemporaryAddress)
                .WithOne()
                .HasForeignKey<ApplicationForm>("TemporaryAddressId")
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ApplicationForm>()
                .HasOne(a => a.FamilyDetails)
                .WithOne()
                .HasForeignKey<ApplicationForm>("FamilyDetailsId")
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ApplicationForm>()
                .HasOne(a => a.AcademicDetails)
                .WithOne()
                .HasForeignKey<ApplicationForm>("AcademicDetailsId")
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<AcademicDetails>()
                .HasOne(a => a.SchoolAddress)
                .WithOne()
                .HasForeignKey<AcademicDetails>("SchoolAddressId")
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
