using System.Collections.Generic;
using System.Threading.Tasks;

namespace FormBackend.Core.Interfaces
{
    public interface ILookupService
    {
        Task<IEnumerable<string>> GetProvinces();
        Task<IEnumerable<string>> GetMunicipalities(string province);
    }
}