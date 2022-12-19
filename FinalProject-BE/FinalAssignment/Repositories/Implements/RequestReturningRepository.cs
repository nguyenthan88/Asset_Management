using System.Linq.Expressions;
using Data;
using Data.Entities;
using FinalAssignment.DTOs.Request;
using FinalAssignment.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using TestWebAPI.Repositories.Implements;

namespace FinalAssignment.Repositories.Implements
{
    public class RequestReturningRepository : BaseRepository<RequestReturning>, IRequestReturningRepository
    {
        public RequestReturningRepository(FinalAssignmentContext context) : base(context)
        { }
        public IEnumerable<RequestReturning> GetAllRequest()
        {
            var getData = _dbSet.Include(p => p.ApplicationUser)
                        .Include(a => a.Assignment).ThenInclude(a => a.AssignedToUser);
            return getData;
        }
        public RequestReturning GetOneRequest(Expression<Func<RequestReturning, bool>>? predicate = null)
        {
            var getData = _dbSet.Include(p => p.ApplicationUser)
                        .Include(a => a.Assignment).ThenInclude(a => a.Asset).FirstOrDefault(predicate);
            return getData;
        }
    }
}