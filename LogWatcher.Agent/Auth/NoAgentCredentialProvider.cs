using LogWatcher.Common.Auth;
using Microsoft.Extensions.Configuration;
using System.Threading;
using System.Threading.Tasks;

namespace LogWatcher.Agent.Auth
{
    /// <summary>Authentication fully disabled — connects to the backend without a token.</summary>
    public class NoAgentCredentialProvider : IAgentCredentialProvider
    {
        public Task<string?> GetBearerTokenAsync(IConfiguration config, CancellationToken ct)
            => Task.FromResult<string?>(null);
    }
}
