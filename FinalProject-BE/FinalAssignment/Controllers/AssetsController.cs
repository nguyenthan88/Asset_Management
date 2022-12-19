using Common.Enums;
using FinalAssignment.DTOs.Asset;
using FinalAssignment.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Data.Entities;

namespace FinalAssignment.Controllers
{
    [Route("api/asset-management")]
    [ApiController]
    public class AssetsController : ControllerBase
    {
        private readonly IAssetService _assetService;
        public AssetsController(IAssetService assetService)
        {
            _assetService = assetService;
        }

        [HttpPost("")]
        public async Task<IActionResult> Create(AssetRequest assetRequest)
        {/*
            var asset = await _assetService.GetAssetByName(assetRequest.AssetName);

            if (asset != null)
                return BadRequest("Asset is already existed. Please enter a different asset. Prefix is already existed. Please enter a different prefix");
*/
            var result = await _assetService.Create(assetRequest);

            if (result == null) 
            {            
                return StatusCode(500, "Sorry the Request failed"); 
            }

            return Ok(result);
        }

        [HttpGet("assets/{assetCode}")]
        public async Task<EditAssetResponse> GetEditAsset(string assetCode)
        {
            var getEdit = await _assetService.GetEditAsset(assetCode);
            return getEdit;
        }

        [HttpPut("{assetCode}")]
        public async Task<IActionResult> EditAsset(EditAssetRequest asset, string assetCode)
        {
            var editAsset = await _assetService.EditAsset(asset, assetCode);
            if (editAsset.InstalledDate > DateTime.Now)
            {
                return BadRequest("Invalid InstallDate!");
            }
            if (editAsset.AssetName == "" || editAsset.Specification == ""
             )
            {
                return BadRequest("Must fill all blank!");
            }
            if (editAsset.AssetStatus == AssetStateEnum.Assigned)
            {
                return BadRequest("Invalid AssetStatus!");
            }
            if (editAsset == null)
            {
                return StatusCode(400, "Not found the Asset");
            }
            return StatusCode(200, "Edit successfully!");
        }

        [HttpDelete("{assetCode}")]
        public async Task<IActionResult> DeleteAsset(string assetCode)
        {
            var data = _assetService.DeleteAsset(assetCode);
            if ((bool)await data == true)
            {
                return StatusCode(200, "delete successfully!");
            }
            return StatusCode(400, "delete false");
        }


        [HttpGet("{assetCode}")]
        public async Task<IActionResult> CheckAsset(string assetCode)
        {
            var checkAsset = await _assetService.CheckAsset(assetCode);
            if (checkAsset == true)
            {
                return StatusCode(200, "Can delete asset");
            }
            return StatusCode(400, "can not delete asset");
        }

        [HttpGet("assets")]
        public async Task<IEnumerable<Asset>> GetAllAsset(string location)
        {
            return await _assetService.GetAllAsset(location);
        }
        [HttpGet("assets-status")]
        public async Task<IEnumerable<AssetResponse>> GetAllAssetByStatus(string location)
        {
            return await _assetService.GetAllAssetByStatus(location);
        }

        [HttpGet("assets-detail/{assetCode}")]
        public async Task<DetailAsset> GetAssignedAsset(string assetCode)
        {
            var getAssignedAsset = await _assetService.GetOneAssetInclude(assetCode);
            return getAssignedAsset;
        }
    }
}
