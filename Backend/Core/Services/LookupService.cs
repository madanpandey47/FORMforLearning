using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FormBackend.Core.Interfaces;
using FormBackend.Models.Enum;

namespace FormBackend.Services
{
    public class LookupService : ILookupService
    {
        private static readonly Dictionary<string, List<string>> NepalProvinces = new()
        {
            { "Koshi Province", new List<string> { "Biratnagar", "Dharan", "Itahari", "Damak" } },
            { "Madhesh Province", new List<string> { "Janakpur", "Birgunj", "Rajbiraj", "Lahan" } },
            { "Bagmati Province", new List<string> { "Kathmandu", "Lalitpur", "Bhaktapur", "Hetauda" } },
            { "Gandaki Province", new List<string> { "Pokhara", "Gorkha", "Lamjung", "Syangja" } },
            { "Lumbini Province", new List<string> { "Butwal", "Siddharthanagar", "Ghorahi", "Tulsipur" } },
            { "Karnali Province", new List<string> { "Birendranagar", "Jumla", "Dolpa", "Mugu" } },
            { "Sudurpashchim Province", new List<string> { "Dhangadhi", "Mahendranagar", "Tikapur", "Amargadhi" } }
        };

        public LookupService()
        {
        }

        public Task<IEnumerable<string>> GetProvinces()
        {
            return Task.FromResult(NepalProvinces.Keys.AsEnumerable());
        }

        public Task<IEnumerable<string>> GetDistricts(string province)
        {
            if (NepalProvinces.TryGetValue(province, out var districts))
            {
                return Task.FromResult(districts.AsEnumerable());
            }
            return Task.FromResult(Enumerable.Empty<string>());
        }

        private IEnumerable<dynamic> GetEnumLookup<T>() where T : Enum
        {
            return Enum.GetValues(typeof(T))
                .Cast<T>()
                .Select(e => new { value = Convert.ToInt32(e), name = e.ToString() })
                .Cast<dynamic>();
        }

        public Task<IEnumerable<dynamic>> GetGenders()
        {
            return Task.FromResult(GetEnumLookup<Gender>());
        }

        public Task<IEnumerable<dynamic>> GetFacultyTypes()
        {
            return Task.FromResult(GetEnumLookup<FacultyType>());
        }

        public Task<IEnumerable<dynamic>> GetBloodTypes()
        {
            return Task.FromResult(GetEnumLookup<BloodType>());
        }

        public Task<IEnumerable<dynamic>> GetAcademicLevels()
        {
            return Task.FromResult(GetEnumLookup<AcademicLevel>());
        }

        public Task<IEnumerable<dynamic>> GetParentTypes()
        {
            return Task.FromResult(GetEnumLookup<ParentType>());
        }
    }
}
