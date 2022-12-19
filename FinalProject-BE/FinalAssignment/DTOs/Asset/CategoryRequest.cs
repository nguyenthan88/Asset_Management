using System.ComponentModel.DataAnnotations;

namespace FinalAssignment.DTOs.Asset
{
    public class CategoryRequest
    {
        public Guid Id { get; set; }

        public string? CategoryCode { get; set; }

        [Required]
        public string? CategoryName { get; set; }
    }
}