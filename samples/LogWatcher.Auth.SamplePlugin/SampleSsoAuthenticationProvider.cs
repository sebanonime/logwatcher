using LogWatcher.Auth.Abstractions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MyCompany.LogWatcher.Auth.Sample;

/// <summary>
/// SAMPLE company-authentication plugin for LogWatcher.Web (Auth:Provider=plugin).
///
/// Shows the full shape a real in-house plugin must implement:
///  - ConfigureServices registers whatever authentication scheme(s) it needs, plus the two
///    policies LogWatcher.Web relies on: "UserOnly" (browser users) and "AgentOnly" (agents).
///  - ConfigurePipeline wires the actual login flow. This sample uses "redirect" mode: the
///    browser is sent to a login URL and, once authenticated, redirected back to
///    "/?token=&lt;jwt&gt;" so the SPA can pick the token up (see IAuthenticationProvider's XML docs).
///  - GetUiDescriptor tells the frontend which mode to render (password / redirect / none).
///
/// This sample fakes the actual SSO round-trip so it can be built, deployed, and smoke-tested
/// with no external dependencies: /auth/sample-sso/login mints a token immediately instead of
/// redirecting to a real identity provider. Replace the marked section with a redirect to your
/// company's SSO login page, and validate its response in a callback route instead.
///
/// To use: build this project, then in LogWatcher.Web/appsettings.json set:
///   "Auth": { "Provider": "plugin", "PluginAssembly": "LogWatcher.Auth.SamplePlugin.dll", "PluginType": "" }
/// (PluginType can stay empty since this assembly only exposes one IAuthenticationProvider.)
/// </summary>
public class SampleSsoAuthenticationProvider : IAuthenticationProvider
{
    // DEMO ONLY. A real plugin never hardcodes a signing secret in the DLL — it either
    // validates tokens issued by the real SSO (via its public keys / introspection endpoint)
    // or reads a secret from configuration/secret storage. This default only exists so the
    // sample works out of the box; override it via SampleSso:Secret in appsettings.
    private const string DefaultDemoSecret = "SAMPLE_PLUGIN_DEMO_SECRET_MIN_32_CHARS_LONG";

    public string ProviderName => "sample-sso";

    public void ConfigureServices(IServiceCollection services, IConfiguration config)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["SampleSso:Secret"] ?? DefaultDemoSecret));

        services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = "SampleUserJwt";
                options.DefaultChallengeScheme = "SampleUserJwt";
            })
            .AddJwtBearer("SampleUserJwt", o => o.TokenValidationParameters = BuildValidationParameters(key))
            .AddJwtBearer("SampleAgentJwt", o => o.TokenValidationParameters = BuildValidationParameters(key));

        // Contract: LogWatcher.Web expects exactly these two policy names to exist.
        services.AddAuthorization(options =>
        {
            options.AddPolicy("UserOnly", p => p
                .AddAuthenticationSchemes("SampleUserJwt")
                .RequireAuthenticatedUser()
                .RequireClaim("role", "user"));

            options.AddPolicy("AgentOnly", p => p
                .AddAuthenticationSchemes("SampleAgentJwt")
                .RequireAuthenticatedUser()
                .RequireClaim("role", "agent"));
        });
    }

    public void ConfigurePipeline(WebApplication app)
    {
        app.UseAuthentication();
        app.UseAuthorization();

        // --- REPLACE ME: redirect to the real in-house SSO's login page instead. ---
        app.MapGet("/auth/sample-sso/login", (HttpContext ctx) =>
        {
            var username = ctx.Request.Query["user"].FirstOrDefault() ?? "demo-user";
            var secret = ctx.RequestServices.GetRequiredService<IConfiguration>()["SampleSso:Secret"] ?? DefaultDemoSecret;
            var token = IssueToken(username, "user", secret);
            return Results.Redirect($"/?token={token}");
        });
    }

    public AuthUiDescriptor GetUiDescriptor(IConfiguration config) => new("redirect", "/auth/sample-sso/login");

    private static string IssueToken(string subject, string role, string secret)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            claims: new[] { new Claim(ClaimTypes.NameIdentifier, subject), new Claim("role", role) },
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static TokenValidationParameters BuildValidationParameters(SymmetricSecurityKey key) => new()
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = key,
        RoleClaimType = "role",
    };
}
