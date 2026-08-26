using LogWatcher.Common.Auth;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace MyCompany.LogWatcher.Auth.Sample;

/// <summary>
/// SAMPLE company-authentication plugin for LogWatcher.Agent (Agent:AuthProvider=plugin).
///
/// A real in-house plugin exchanges an agent client id/secret (or certificate, managed
/// identity, etc.) for a bearer token by calling the company SSO's token endpoint — typically
/// an OAuth2 client_credentials grant — and should cache the result and refresh it before it
/// expires. This sample mints the token locally instead, so it can be built and smoke-tested
/// against LogWatcher.Auth.SamplePlugin with no external SSO server involved. The two demo
/// secrets must match (see SampleSso:Secret in both appsettings.json files).
///
/// To use: build this project, then in LogWatcher.Agent/appsettings.json set:
///   "Agent": { "AuthProvider": "plugin", "PluginAssembly": "LogWatcher.Agent.Auth.SamplePlugin.dll", "PluginType": "" }
/// </summary>
public class SampleSsoAgentCredentialProvider : IAgentCredentialProvider
{
    // DEMO ONLY — see SampleSsoAuthenticationProvider for why this must not be hardcoded in production.
    private const string DefaultDemoSecret = "SAMPLE_PLUGIN_DEMO_SECRET_MIN_32_CHARS_LONG";

    public Task<string?> GetBearerTokenAsync(IConfiguration config, CancellationToken ct)
    {
        var clientId = config["SampleSso:ClientId"] ?? "demo-agent-client";
        var secret = config["SampleSso:Secret"] ?? DefaultDemoSecret;

        // --- REPLACE ME: call the in-house SSO's token endpoint with ClientId/ClientSecret
        // (OAuth2 client_credentials grant) instead of minting the token locally, and cache
        // the result until shortly before it expires. ---
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            claims: new[] { new Claim(ClaimTypes.NameIdentifier, clientId), new Claim("role", "agent") },
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds);

        return Task.FromResult<string?>(new JwtSecurityTokenHandler().WriteToken(token));
    }
}
