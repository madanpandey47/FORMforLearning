using FormBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace FormBackend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Student> Students { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<Parent> Parents { get; set; }
        public DbSet<AcademicHistory> AcademicHistories { get; set; }
        public DbSet<AcademicEnrollment> AcademicEnrollments { get; set; }
        public DbSet<Achievement> Achievements { get; set; }
        public DbSet<Citizenship> Citizenships { get; set; }
        public DbSet<SecondaryInfos> ContactInfos { get; set; }
        public DbSet<Disability> Disabilities { get; set; }
        public DbSet<Hobby> Hobbies { get; set; }
        public DbSet<Faculty> Faculties { get; set; }
        public DbSet<Scholarship> Scholarships { get; set; }
        

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Parent>()
                .Property(p => p.AnnualIncome)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Scholarship>()
                .Property(s => s.Amount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Student>()
                .HasOne(s => s.Citizenship)
                .WithOne()
                .HasForeignKey<Citizenship>("StudentId")
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Student>()
                .HasOne(s => s.ContactInfo)
                .WithOne()
                .HasForeignKey<SecondaryInfos>("StudentId")
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Student>()
                .HasMany(s => s.Addresses)
                .WithOne()
                .HasForeignKey("StudentId")
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Student>()
                .HasMany(s => s.Parents)
                .WithOne()
                .HasForeignKey("StudentId")
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<Student>()
                .HasMany(s => s.AcademicHistories)
                .WithOne()
                .HasForeignKey("StudentId")
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Student>()
                .HasOne(s => s.AcademicEnrollment)
                .WithOne(ae => ae.Student)
                .HasForeignKey<AcademicEnrollment>(ae => ae.StudentId)
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<Student>()
                .HasMany(s => s.Achievements)
                .WithOne()
                .HasForeignKey("StudentId")
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Student>()
                .HasMany(s => s.Hobbies)
                .WithOne()
                .HasForeignKey("StudentId")
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<Student>()
                .HasOne(s => s.Disability)
                .WithOne()
                .HasForeignKey<Disability>("StudentId")
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<Student>()
                .HasOne(s => s.Scholarship)
                .WithOne()
                .HasForeignKey<Scholarship>("StudentId")
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
