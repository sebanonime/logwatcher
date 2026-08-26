using LogWatcher.Common.Auth;
using Microsoft.Extensions.Configuration;
using System;

namespace LogWatcher.Agent.Auth
{
    /// <summary>
    /// Resolves the active IAgentCredentialProvider based on Agent:AuthProvider in config.
    /// To use a company-developed provider without recompiling, set Agent:AuthProvider to
    /// "plugin" and point Agent:PluginAssembly (+ optional Agent:PluginType) at the compiled
    /// plugin DLL.
    /// </summary>
    public static class AgentCredentialProviderFactory
    {
        public static IAgentCredentialProvider Create(IConfiguration config)
        {
            // Defaults to "none": a fresh copy-exe-and-dll deployment connects unauthenticated
            // until an admin explicitly opts into "static" or "plugin".
            var providerName = config["Agent:AuthProvider"] ?? "none";
            return providerName.ToLowerInvariant() switch
            {
                "none" => new NoAgentCredentialProvider(),
                "static" => new StaticAgentCredentialProvider(),
                "plugin" => PluginLoader.Load<IAgentCredentialProvider>(config["Agent:PluginAssembly"], config["Agent:PluginType"]),
                _ => throw new InvalidOperationException(
                    $"Unknown Agent:AuthProvider '{providerName}'. Supported: none, static, plugin")
            };
        }
    }
}
