using LogWatcher.Auth.Abstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LogWatcher.Web.Controllers
{
    /// <summary>
    /// Issues user JWT tokens for browser clients.
    /// In the JWT provider mode, this is a simple username/password login.
    /// When a company auth provider is active, the frontend uses GetConfig() to
    /// discover its login mode instead (e.g. a redirect to the provider's own flow).
    /// </summary>
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IAuthenticationProvider _authProvider;

        public AuthController(IConfiguration config, IAuthenticationProvider authProvider)
        {
            _config = config;
            _authProvider = authProvider;
        }

        /// <summary>Tells the frontend how to present login for the currently active provider.</summary>
        [HttpGet("config")]
        [AllowAnonymous]
        public ActionResult<AuthUiDescriptor> GetConfig()
        {
            return Ok(_authProvider.GetUiDescriptor(_config));
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // Simple hardcoded check for now — replace with proper user store in Phase 8
            var adminUser = _config["Auth:AdminUser"] ?? "admin";
            var adminPass = _config["Auth:AdminPassword"] ?? "changeme";

            if (request.Username != adminUser || request.Password != adminPass)
                return Unauthorized();

            var secret = _config["Jwt:UserSecret"]
                ?? throw new InvalidOperationException("Jwt:UserSecret not configured.");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: new[]
                {
                    new Claim("sub", request.Username),
                    new Claim("role", "user")
                },
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: creds
            );

            return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
        }
    }

    public record LoginRequest(string Username, string Password);
}
