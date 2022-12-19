using FinalAssignment.DTOs.Assignment;
using FinalAssignment.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FinalAssignment.Controllers
{
    [Route("/api/assignment-management")]
    [ApiController]
    public class AssignmentController : ControllerBase
    {
        private readonly ILoggerManager _logger;
        private readonly IAssignmentService _assignmentService;
        public AssignmentController(IAssignmentService assignmentService, ILoggerManager logger)
        {
            _logger = logger  ;
            _assignmentService = assignmentService;          
        }
        [HttpPost("assignments")]
        public async Task<IActionResult> Create(CreateAssignmentRequest assignmentRequest)
        {
            var result = await _assignmentService.Create(assignmentRequest);

            if (result == null) return StatusCode(500, "Result null");

            return Ok(result);
        }

        [HttpPut("assignments")]
        public async Task<IActionResult> EditAssignment(EditAssignmentRequest editAssignmentRequest, Guid id)
        {
            var result = await _assignmentService.EditAssignment(editAssignmentRequest, id);

            if (result == null) return StatusCode(500, "Result null");

            return Ok(result);
        }

        [HttpGet("assignments-id/{id}")]
        public async Task<IActionResult> GetAssignmentById(Guid id)
        {
            var result = await _assignmentService.GetAssignmentById(id);

            if (result == null) return StatusCode(500, "Result null");

            return Ok(result);
        }

        [HttpGet("assignments/location/{location}")]
        public async Task<IActionResult> GetAll(string location)
        {
            var result = await _assignmentService.GetAll(location);

            if (result == null) return StatusCode(500, "Result null");

            return Ok(result);
        }
        
        [HttpPut("assignments/accept-assignment/{id}")]
        public async Task<IActionResult> AcceptAssignment(Guid id)
        {
            var result = await _assignmentService.AcceptAssignment(id);

            if (result == null) return StatusCode(500, "Result null");

            return Ok(result);
        }

        [HttpPut("assignments/decline-assignment/{id}")]
        public async Task<IActionResult> DeclineAssignment(Guid id)
        {
            var result = await _assignmentService.DeclineAssignment(id);

            if (result == null) return StatusCode(500, "Result null");

            return Ok(result);
        }

        [HttpDelete("assignments/{assetCode}")]
        public async Task<IActionResult> DeleteAsset(Guid id)
        {
            var data = _assignmentService.DeleteAssignmentByAdmin(id);
            if ((bool)await data == true)
            {
                return StatusCode(200, "delete successfully!");
            }
            return StatusCode(400, "delete false");
        }

        [HttpGet("assignments/{userId}")]
        public async Task<IActionResult> GetAllDependUser(string userId)
        {
            var result = await _assignmentService.GetAllDependUser(userId);

            if (result == null) return StatusCode(500, "Result null");

            return Ok(result);
        }
        
        [HttpGet("assignments-detail")]
        public async Task<IActionResult> GetAssignmentDetail(string assetCode)
        {
            var result = await _assignmentService.GetAssignmentDetail(assetCode);

            if (result == null) return StatusCode(500, "Result null");

            return Ok(result);
        }
    }
}
