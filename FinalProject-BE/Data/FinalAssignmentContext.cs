using Data.Auth;
using Data.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Data
{
    public class FinalAssignmentContext : IdentityDbContext<ApplicationUser>
    {
        public FinalAssignmentContext(DbContextOptions<FinalAssignmentContext> options) : base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ApplicationUser>().Property(x => x.Id).HasMaxLength(225);

            #region User

            modelBuilder.Entity<ApplicationUser>()
                       .ToTable("AspNetUsers")//ten bang trong sql
                       .HasKey(cat => cat.Id);//khoa chinh

            #endregion

            #region Category

            modelBuilder.Entity<Category>()
                       .ToTable("Category")//ten bang trong sql
                       .HasKey(cat => cat.Id);//khoa chinh

            #endregion

            #region Asset

            modelBuilder.Entity<Asset>()
                           .ToTable("Asset")
                           .HasKey(pro => pro.Id);

            modelBuilder.Entity<Asset>()
                            .HasOne<Category>(s => s.Category)//trong asset lay category 
                            .WithMany(g => g.Assets)//1 category nay ket noi nhieu asset
                            .HasForeignKey(s => s.CategoryId);

            #endregion

            #region Assignment

            modelBuilder.Entity<Assignment>()
                           .ToTable("Assignment")
                           .HasKey(pro => pro.Id);

            modelBuilder.Entity<Assignment>()
                            .Property(pro => pro.Id)
                            .HasColumnName("Id")
                            .HasColumnType("uniqueidentifier")
                            .HasMaxLength(50);

            modelBuilder.Entity<Assignment>()
                            .HasOne(b => b.Asset)
                            .WithMany(b => b.Assignments)
                            .HasForeignKey(b => b.AssetId);

            modelBuilder.Entity<Assignment>()
                            .HasOne<ApplicationUser>(s => s.AssignedToUser)
                            .WithMany(g => g.AssignedToMe)
                            .HasForeignKey(s => s.AssignedTo)
                            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Assignment>()
                            .HasOne<ApplicationUser>(s => s.AssignedByUser)
                            .WithMany(g => g.AssignedByMe)
                            .HasForeignKey(s => s.AssignedBy)
                            .OnDelete(DeleteBehavior.Restrict);

            #endregion

            #region RequestReturning

            modelBuilder.Entity<RequestReturning>()
                            .HasKey(t => t.Id);

            modelBuilder.Entity<RequestReturning>()
                            .HasOne(pt => pt.ApplicationUser)
                            .WithMany(p => p.RequestReturnings)
                            .HasForeignKey(pt => pt.UserId);

            modelBuilder.Entity<RequestReturning>()
                            .HasOne(pt => pt.Assignment)
                            .WithMany(t => t.RequestReturnings)
                            .HasForeignKey(pt => pt.AssignmentId);

            #endregion

        }
        public DbSet<Category>? Categories { get; set; }
        public DbSet<Asset>? Assets { get; set; }
        public DbSet<Assignment>? Assignments { get; set; }
        public DbSet<RequestReturning>? RequestReturnings { get; set; }
    }
}
