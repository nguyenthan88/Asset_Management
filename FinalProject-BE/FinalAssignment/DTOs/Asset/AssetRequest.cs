using Common.Enums;
using System.ComponentModel.DataAnnotations;

namespace FinalAssignment.DTOs.Asset
{
    public class AssetRequest
    {
        public Guid CategoryId { get; set; }       

        public string? AssetName { get; set; }

        public string? Specification { get; set; }

        public AssetStateEnum AssetStatus { get; set; }

        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{yyyy-MM-dd}")]

        public DateTime InstalledDate { get; set; }

        public string? Location { get; set; }
    }
}