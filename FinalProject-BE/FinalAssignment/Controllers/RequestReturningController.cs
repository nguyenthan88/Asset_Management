using Data.Entities;
using FinalAssignment.DTOs.Request;
using FinalAssignment.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FinalAssignment.Controllers
{
    [Route("api/request-returning-management")]
    [ApiController]
    public class RequestReturningController : ControllerBase
    {
        private readonly IRequestReturningService _requestReturningService;
        public RequestReturningController (IRequestReturningService requestReturningService)
        {
            _requestReturningService = requestReturningService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateCreateRequestForReturning(CreateRequestReturningRequest model)
        {

            var request = await _requestReturningService.CreateRequestForReturning(model);

            if (request == null)
                return BadRequest("Assignment is not existed. Please choose a different assignment");

            if (request.Status.Equals("Error"))
                return StatusCode(500, "Sorry the Request failed");

            return Ok(request);
        }

        [HttpGet("returning-request")]
        public async Task<IEnumerable<ReturningRequest>> GetAllReturningRequest()
        {
            return await _requestReturningService.GetAllReturningRequest();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> CompleteRequest(Guid id)
        {
            var data = _requestReturningService.CompleteRequest(id);
            if ((bool)await data == true)
            {
                return StatusCode(200, "Complete successfully!");
            }
            return StatusCode(400, "Complete false");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelRequest(Guid id)
        {
            var data = _requestReturningService.CancelRequest(id);
            if ((bool)await data == true)
            {
                return StatusCode(200, "cancel successfully!");
            }
            return StatusCode(400, "cancel false");
        }
    }
}
