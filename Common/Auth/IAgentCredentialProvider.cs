using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace LogWatcher.Common.Auth
{
    /// <summary>
    /// Extensibility seam for how the Agent authenticates to the backend. The active provider is
    /// selected via Agent:AuthProvider in LogWatcher.Agent's appsettings.json
    /// ("static" | "none" | "plugin"). Implement this to fetch a token from a company SSO system
    /// (e.g. an OAuth2 client-credentials exchange using a client id/secret).
    /// </summary>
    public interface IAgentCredentialProvider
    {
        /// <summary>Returns the bearer token to send with the gRPC connection, or null/empty to send none.</summary>
        Task<string?> GetBearerTokenAsync(IConfiguration config, CancellationToken ct);
    }
}
