using Data.Entities;
using FinalAssignment.DTOs.Asset;

namespace FinalAssignment.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<Category> GetCategoryByName(string categoryName);

        Task<Category?> Create(CategoryRequest createRequest);

        Task<IEnumerable<Category>> GetAll();


    }
}