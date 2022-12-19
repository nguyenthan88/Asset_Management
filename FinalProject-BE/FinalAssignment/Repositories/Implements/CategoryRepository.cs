using Data;
using Data.Entities;
using FinalAssignment.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using TestWebAPI.Repositories.Implements;

namespace FinalAssignment.Repositories.Implements
{
    public class CategoryRepository : BaseRepository<Category>, ICategoryRepository
    {
        public CategoryRepository(FinalAssignmentContext context) : base (context)
        {}

        public IEnumerable<Category> GetAllCategoryInclude()
        {
            var getAllCategory = _dbSet.Include(a => a.Assets);
            return getAllCategory;
        }
    }
}