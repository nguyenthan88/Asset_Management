using FinalAssignment.Repositories.Interfaces;
using System.Linq.Expressions;

namespace TestWebAPI.Repositories.Interfaces
{
    public interface IBaseRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, bool>> predicate = null);
        Task<T>? GetOneAsync(Expression<Func<T, bool>> predicate);
        T? GetOne(Expression<Func<T, bool>>? predicate = null, Expression<Func<T, object>>? includePredicate = null);
        Task<T> CreateAsync(T entity);
        Task<T> UpdateAsync(T entity);
        Task<bool> DeleteAsync(T entity);
        int SaveChanges();
        IDatabaseTransaction DatabaseTransaction();

    }
}