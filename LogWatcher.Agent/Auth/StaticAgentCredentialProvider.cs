using LogWatcher.Common.Auth;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace LogWatcher.Agent.Auth
{
    /// <summary>Reads a pre-issued bearer token straight from config (today's behavior).</summary>
    public class StaticAgentCredentialProvider : IAgentCredentialProvider
    {
        public Task<string?> GetBearerTokenAsync(IConfiguration config, CancellationToken ct)
        {
            var token = config["Agent:Token"]
                ?? throw new InvalidOperationException("Agent:Token not configured.");
            return Task.FromResult<string?>(token);
        }
    }
}
