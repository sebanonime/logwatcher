using LogWatcher.Auth.Abstractions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace LogWatcher.Web.Auth
{
    /// <summary>
    /// JWT-based authentication provider (current implementation).
    /// Registers two schemes:
    ///   - "AgentJwt"  → validates agent tokens (role=agent, signed with Jwt:AgentSecret)
    ///   - "UserJwt"   → validates user tokens  (role=user,  signed with Jwt:UserSecret)
    /// </summary>
    public class JwtAuthenticationProvider : IAuthenticationProvider
    {
        public string ProviderName => "jwt";

        public void ConfigureServices(IServiceCollection services, IConfiguration config)
        {
            var agentSecret = config["Jwt:AgentSecret"]
                ?? throw new InvalidOperationException("Jwt:AgentSecret is required in configuration.");
            var userSecret = config["Jwt:UserSecret"]
                ?? throw new InvalidOperationException("Jwt:UserSecret is required in configuration.");

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = "UserJwt";
                options.DefaultChallengeScheme = "UserJwt";
            })
            .AddJwtBearer("AgentJwt", options =>
            {
                options.MapInboundClaims = false; // keep "role" as "role", not remapped to ClaimTypes.Role URI
                options.TokenValidationParameters = BuildParams(agentSecret);
                // Allow token from query string for SignalR WebSocket connections
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = ctx =>
                    {
                        var token = ctx.Request.Query["access_token"];
                        if (!string.IsNullOrEmpty(token))
                            ctx.Token = token;
                        return Task.CompletedTask;
                    }
                };
            })
            .AddJwtBearer("UserJwt", options =>
            {
                options.MapInboundClaims = false; // keep "role" as "role", not remapped to ClaimTypes.Role URI
                options.TokenValidationParameters = BuildParams(userSecret);
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = ctx =>
                    {
                        var token = ctx.Request.Query["access_token"];
                        if (!string.IsNullOrEmpty(token))
                            ctx.Token = token;
                        return Task.CompletedTask;
                    }
                };
            });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("AgentOnly", policy =>
                    policy.RequireAuthenticatedUser()
                          .AddAuthenticationSchemes("AgentJwt")
                          .RequireClaim("role", "agent"));

                options.AddPolicy("UserOnly", policy =>
                    policy.RequireAuthenticatedUser()
                          .AddAuthenticationSchemes("UserJwt")
                          .RequireClaim("role", "user"));
            });
        }

        public void ConfigurePipeline(WebApplication app)
        {
            app.UseAuthentication();
            app.UseAuthorization();
        }

        public AuthUiDescriptor GetUiDescriptor(IConfiguration config) => new("password");

        private static TokenValidationParameters BuildParams(string secret) => new()
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
            ClockSkew = TimeSpan.FromSeconds(30),
            // Keep claim names exactly as written in the token (e.g. "role")
            // Without this, .NET remaps "role" → ClaimTypes.Role (long URI), breaking RequireClaim("role", ...)
            NameClaimType = "sub",
            RoleClaimType = "role",
        };
    }
}
