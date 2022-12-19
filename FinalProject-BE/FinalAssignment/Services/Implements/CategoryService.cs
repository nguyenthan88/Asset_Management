using Data.Entities;
using FinalAssignment.DTOs.Asset;
using FinalAssignment.Repositories.Interfaces;
using FinalAssignment.Services.Interfaces;

namespace FinalAssignment.Services.Implements
{
    public class CategoryService : ICategoryService
    {

        private readonly ICategoryRepository _categoryRepository;
        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<Category?> Create(CategoryRequest createRequest)
        {
            using (var transaction = _categoryRepository.DatabaseTransaction())
            {
                try
                {
                    if (createRequest == null) return null;
                    var newCategory = new Category
                    {
                        Id = Guid.NewGuid(),
                        CategoryCode = createRequest.CategoryCode,
                        CategoryName = createRequest.CategoryName,
                    };
                    var createCategory = await _categoryRepository.CreateAsync(newCategory);


                    _categoryRepository.SaveChanges();
                    transaction.Commit();

                    return new Category
                    {
                        Id = Guid.NewGuid(),
                        CategoryCode = createRequest.CategoryCode,
                        CategoryName = createCategory.CategoryName,
                    };
                }
                catch
                {
                    transaction.RollBack();
                    return null;
                }
            }
        }

        public async Task<IEnumerable<Category>> GetAll()
        {
            return await _categoryRepository.GetAllAsync();
        }

        public async Task<Category> GetCategoryByName(string categoryName)
        {
            return await _categoryRepository.GetOneAsync(x => x.CategoryName == categoryName);
        }

    }
}