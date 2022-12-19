using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Common.Enums;
using Data.Auth;
using Data.Entities;

namespace FinalAssignment.DTOs.Request
{
    public class ReturningRequest
    {
        public Guid Id { get; set; }
        public string AssetCode { get; set; }
        public string AssetName { get; set; }
        public string RequestBy { get; set; }
        public DateTimeOffset AssignedDate { get; set; }
        public string AcceptedBy { get; set; }
        public string ReturnDate { get; set; }
        public RequestStateEnum RequestStatus { get; set; }
        public DateTime Time { get; set; }

    }
}
