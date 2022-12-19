using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Data.Entities;
using FinalAssignment.DTOs.Request;
using TestWebAPI.Repositories.Interfaces;

namespace FinalAssignment.Repositories.Interfaces
{
    public interface IRequestReturningRepository : IBaseRepository<RequestReturning>
    {
        IEnumerable<RequestReturning> GetAllRequest();
        RequestReturning GetOneRequest(Expression<Func<RequestReturning, bool>>? predicate = null);

    }
}