using Microsoft.AspNetCore.Mvc;
using International_Payments_Portal.Server.Models;
using International_Payments_Portal.Server.Services;
using International_Payments_Portal.Server.Data;
using System.Linq;

namespace International_Payments_Portal.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly InputValidator _validator;
        private readonly AppDbContext _context;

        public PaymentController(AppDbContext context)
        {
            _validator = new InputValidator();
            _context = context;
        }

        [HttpPost("process")]
        public IActionResult ProcessPayment([FromBody] PaymentRequest request)
        {
            // VALIDATION
            if (!_validator.IsValidIBAN(request.ReceiverIBAN))
                return BadRequest(new { message = "Invalid IBAN format" });

            if (!_validator.IsValidSWIFT(request.ReceiverSWIFT))
                return BadRequest(new { message = "Invalid SWIFT code" });

            if (!_validator.IsValidAmount(request.Amount))
                return BadRequest(new { message = "Invalid amount (must be between 0.01 and 1,000,000)" });

            // Sanitize description
            string safeDescription = _validator.SanitizeInput(request.Description);

            // Generate transaction ID
            string transactionId = $"TXN-{DateTime.Now:yyyyMMddHHmmss}-{new Random().Next(1000, 9999)}";

            // Calculate fee
            decimal fee = request.Amount * 0.01m;
            if (fee < 5) fee = 5;

            // SAVE TO DATABASE
            var payment = new Payment
            {
                UserId = request.UserId,
                ReceiverIBAN = request.ReceiverIBAN,
                ReceiverSWIFT = request.ReceiverSWIFT,
                Amount = request.Amount,
                Currency = request.Currency,
                Description = safeDescription,
                TransactionId = transactionId,
                Fee = fee,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.Payments.Add(payment);
            _context.SaveChanges();

            // RESPONSE
            var response = new PaymentResponse
            {
                Success = true,
                TransactionId = transactionId,
                Message = "Payment submitted for staff verification",
                Amount = request.Amount,
                Fee = fee,
                TransactionDate = DateTime.UtcNow
            };

            return Ok(response);
        }

        [HttpGet("transactions")]
        public IActionResult GetTransactions()
        {
            var transactions = _context.Payments
                .Join(
                    _context.Users,
                    payment => payment.UserId,
                    user => user.Id,
                    (payment, user) => new
                    {
                        payment.Id,
                        payment.UserId,
                        payment.ReceiverIBAN,
                        payment.ReceiverSWIFT,
                        payment.Amount,
                        payment.Currency,
                        payment.Description,
                        payment.Status,
                        payment.TransactionId,
                        payment.Fee,
                        payment.ReviewedAt,
                        payment.ReviewedBy,
                        payment.ReviewNotes,
                        AccountHolder = user.FullName,
                        TransactionDate = payment.CreatedAt
                    }
                )
                .OrderByDescending(p => p.TransactionDate)
                .ToList();

            return Ok(new
            {
                success = true,
                data = transactions
            });
        }

        [HttpGet("transactions/user/{userId}")]
        public IActionResult GetUserTransactions(int userId)
        {
            if (userId <= 0)
                return BadRequest(new { message = "A valid customer ID is required" });

            var transactions = _context.Payments
                .Where(payment => payment.UserId == userId)
                .OrderByDescending(payment => payment.CreatedAt)
                .Take(10)
                .Select(payment => new
                {
                    payment.Id,
                    payment.TransactionId,
                    payment.ReceiverIBAN,
                    payment.Amount,
                    payment.Currency,
                    payment.Description,
                    payment.Status,
                    payment.CreatedAt,
                    payment.ReviewedAt,
                    payment.ReviewNotes
                })
                .ToList();

            return Ok(new
            {
                success = true,
                data = transactions
            });
        }

        [HttpPut("transactions/{id}/status")]
        public IActionResult UpdateTransactionStatus(int id, [FromBody] UpdatePaymentStatusRequest request)
        {
            var allowedStatuses = new[] { "Approved", "Rejected" };
            var status = allowedStatuses.FirstOrDefault(
                allowed => allowed.Equals(request.Status, StringComparison.OrdinalIgnoreCase));

            if (status == null)
                return BadRequest(new { message = "Status must be Approved or Rejected" });

            var reviewedBy = _validator.SanitizeInput(request.ReviewedBy).Trim();
            var reviewNotes = _validator.SanitizeInput(request.ReviewNotes).Trim();

            if (string.IsNullOrWhiteSpace(reviewedBy))
                return BadRequest(new { message = "Reviewer identity is required" });

            if (status == "Rejected" && string.IsNullOrWhiteSpace(reviewNotes))
                return BadRequest(new { message = "A rejection reason is required" });

            if (reviewNotes.Length > 500)
                return BadRequest(new { message = "Review notes cannot exceed 500 characters" });

            var payment = _context.Payments.Find(id);
            if (payment == null)
                return NotFound(new { message = "Transaction not found" });

            if (!string.Equals(payment.Status, "Pending", StringComparison.OrdinalIgnoreCase))
                return BadRequest(new { message = "Only pending transactions can be reviewed" });

            payment.Status = status;
            payment.ReviewedBy = reviewedBy;
            payment.ReviewNotes = reviewNotes;
            payment.ReviewedAt = DateTime.UtcNow;
            _context.SaveChanges();

            return Ok(new
            {
                success = true,
                message = $"Transaction {status.ToLowerInvariant()} successfully",
                data = new
                {
                    payment.Id,
                    payment.Status,
                    payment.ReviewedAt,
                    payment.ReviewedBy,
                    payment.ReviewNotes
                }
            });
        }
    }
}
