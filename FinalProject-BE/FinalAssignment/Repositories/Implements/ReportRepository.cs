using Data;
using Data.Entities;
using FinalAssignment.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using TestWebAPI.Repositories.Implements;

namespace FinalAssignment.Repositories.Implements
{
    public class ReportRepository : BaseRepository<Report>, IReportRepository
    {
        public ReportRepository(FinalAssignmentContext context) : base(context)
        {

        }
        // public IEnumerable<Category> GetAllCategory()
        // {
        //     var getData = _dbSet.Include(p => p.);
        //     return getData;
        // }
    }
}