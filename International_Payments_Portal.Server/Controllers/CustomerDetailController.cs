using Microsoft.AspNetCore.Mvc;
using International_Payments_Portal.Server.Data;
using International_Payments_Portal.Server.Models;

namespace International_Payments_Portal.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerDetailController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CustomerDetailController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("create")]
        public IActionResult CreateCustomer([FromBody] CustomerDetail request)
        {
            if (string.IsNullOrWhiteSpace(request.AccountHolder))
                return BadRequest(new { message = "Account Holder is required" });

            if (string.IsNullOrWhiteSpace(request.AccountNumber))
                return BadRequest(new { message = "Account Number is required" });

            if (string.IsNullOrWhiteSpace(request.BranchCode))
                return BadRequest(new { message = "Branch Code is required" });

            if (string.IsNullOrWhiteSpace(request.AccountType))
                return BadRequest(new { message = "Account Type is required" });

            _context.CustomerDetails.Add(request);
            _context.SaveChanges();

            return Ok(new
            {
                success = true,
                message = "Customer created successfully",
                customer = request
            });
        }

        [HttpGet("all")]
        public IActionResult GetAllCustomers()
        {
            var customers = _context.CustomerDetails.ToList();

            return Ok(new
            {
                success = true,
                data = customers
            });
        }

        [HttpGet("{id}")]
        public IActionResult GetCustomerById(int id)
        {
            var customer = _context.CustomerDetails.Find(id);

            if (customer == null)
                return NotFound(new { message = "Customer not found" });

            return Ok(new
            {
                success = true,
                data = customer
            });
        }
    }
}