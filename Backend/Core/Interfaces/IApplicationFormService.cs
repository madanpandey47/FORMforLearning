using FormBackend.DTOs;
using FormBackend.Models;
using System.Threading.Tasks;

namespace FormBackend.Core.Interfaces
{
    public interface IApplicationFormService
    {
        Task<ApplicationForm> CreateApplicationFormAsync(ApplicationFormDTO applicationFormDto);
    }
}
