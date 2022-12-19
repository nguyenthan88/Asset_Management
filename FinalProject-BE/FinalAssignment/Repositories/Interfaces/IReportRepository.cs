using Data.Entities;
using TestWebAPI.Repositories.Interfaces;

namespace FinalAssignment.Repositories.Interfaces
{
    public interface IReportRepository : IBaseRepository<Report>
    {
        // IEnumerable<Category> GetAllCategory();
    }
}