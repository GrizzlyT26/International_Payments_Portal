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
                Status = "Completed",
                CreatedAt = DateTime.UtcNow
            };

            _context.Payments.Add(payment);
            _context.SaveChanges();

            // RESPONSE
            var response = new PaymentResponse
            {
                Success = true,
                TransactionId = transactionId,
                Message = "Payment processed successfully",
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
    }
}