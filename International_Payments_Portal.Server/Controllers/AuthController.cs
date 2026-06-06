using International_Payments_Portal.Server.Data;
using International_Payments_Portal.Server.Models;
using International_Payments_Portal.Server.Services;
using Microsoft.AspNetCore.Mvc;
using System;

namespace International_Payments_Portal.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly PasswordHasher _passwordHasher;
        private readonly InputValidator _validator;
        private readonly AppDbContext _context;

        // ✅ Inject DbContext
        public AuthController(AppDbContext context)
        {
            _context = context;
            _passwordHasher = new PasswordHasher();
            _validator = new InputValidator();
        }

        // ✅ REGISTER
        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterModel model)
        {
            if (model == null)
                return BadRequest(new { message = "Request body is empty" });

            if (string.IsNullOrWhiteSpace(model.Email) ||
                string.IsNullOrWhiteSpace(model.Password) ||
                string.IsNullOrWhiteSpace(model.FullName))
            {
                return BadRequest(new { message = "All fields are required" });
            }

            if (!_validator.IsValidEmail(model.Email))
                return BadRequest(new { message = "Invalid email format" });

            // 🔥 CHECK DATABASE
            if (_context.Users.Any(u => u.Email.ToLower() == model.Email.ToLower()))
                return BadRequest(new { message = "Email already registered" });

            var (hash, salt) = _passwordHasher.HashPassword(model.Password);

            var user = new User
            {
                Email = model.Email,
                FullName = model.FullName,
                PasswordHash = hash,
                PasswordSalt = salt,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Registration successful",
                userId = user.Id
            });
        }

        // ✅ LOGIN
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            if (model == null)
                return BadRequest(new { message = "Request body is empty" });

            if (string.IsNullOrWhiteSpace(model.Email) ||
                string.IsNullOrWhiteSpace(model.Password))
            {
                return BadRequest(new { message = "Email and password are required" });
            }

            // 🔥 GET FROM DATABASE
            var user = _context.Users
                .FirstOrDefault(u => u.Email.ToLower() == model.Email.ToLower());

            if (user == null)
                return Unauthorized(new { message = "Invalid credentials" });

            if (!_passwordHasher.VerifyPassword(model.Password, user.PasswordHash, user.PasswordSalt))
                return Unauthorized(new { message = "Invalid credentials" });

            return Ok(new
            {
                message = "Login successful",
                user = new
                {
                    user.Id,
                    user.Email,
                    user.FullName,
                    Role = "customer"
                },
                token = GenerateSimpleToken(user.Id)
            });
        }

        // ✅ STAFF LOGIN (Hardcoded credentials)
        [HttpPost("staff-login")]
        public IActionResult StaffLogin([FromBody] LoginModel model)
        {
            if (model == null)
                return BadRequest(new { message = "Request body is empty" });

            if (string.IsNullOrWhiteSpace(model.Email) ||
                string.IsNullOrWhiteSpace(model.Password))
            {
                return BadRequest(new { message = "Email and password are required" });
            }

            // 🔥 HARDCODED STAFF CREDENTIALS
            var validStaffCredentials = new[]
            {
                new { Email = "st10439724@rcconnect.edu.za", Password = "internationalP@47" },
                new { Email = "st10503750@rcconnect.edu.za", Password = "internationalP@47" },
                new { Email ="st10108083@rcconnect.edu.za", Password = "internationalP@47" },
                new { Email = "st10501179@rcconnect.edu.za", Password = "internationalP@47" }
            };

            var staffMember = validStaffCredentials
                .FirstOrDefault(s => s.Email.ToLower() == model.Email.ToLower() && s.Password == model.Password);

            if (staffMember == null)
                return Unauthorized(new { message = "Invalid staff credentials" });

            return Ok(new
            {
                message = "Staff login successful",
                user = new
                {
                    Id = 0,
                    Email = staffMember.Email,
                    FullName = "Staff Member",
                    Role = "staff"
                },
                token = GenerateSimpleToken(0)
            });
        }

        private string GenerateSimpleToken(int userId)
        {
            return Convert.ToBase64String(Guid.NewGuid().ToByteArray());
        }
    }
}