using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using FormBackend.Models;
using FormBackend.Models.Enum;
using Microsoft.AspNetCore.Http;

namespace FormBackend.DTOs{

    public class AddressDTO
    {
        public required string Province { get; set; }
        public required string Municipality { get; set; }
        public required string Ward { get; set; }
        public string? Street { get; set; }
        public required string Country { get; set; } = "Nepal";
        public AddressType Type { get; set; }
    }
}