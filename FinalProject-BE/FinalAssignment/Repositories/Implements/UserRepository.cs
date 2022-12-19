using Data;
using Data.Auth;
using FinalAssignment.Repositories.Interfaces;
using TestWebAPI.Repositories.Implements;

namespace FinalAssignment.Repositories.Implements
{
    public class UserRepository : BaseRepository<ApplicationUser>, IUserRepository
    {
        public UserRepository(FinalAssignmentContext context) : base (context)
        {
        }

        public  string getUserName(string id)
        {
            var getUser =  _dbSet.FirstOrDefault(x => x.Id == id);
            if (getUser == null) return null;
            string a = getUser.UserName;
            return a;
        }
    }
}