using LogWatcher.Auth.Abstractions;
using LogWatcher.Common.Auth;

namespace LogWatcher.Web.Auth
{
    /// <summary>
    /// Resolves the active IAuthenticationProvider based on Auth:Provider in config.
    /// Adding a new built-in provider: implement IAuthenticationProvider and register it here.
    /// To use a company-developed provider without recompiling, set Auth:Provider to "plugin"
    /// and point Auth:PluginAssembly (+ optional Auth:PluginType) at the compiled plugin DLL.
    /// </summary>
    public static class AuthProviderFactory
    {
        public static IAuthenticationProvider Create(IConfiguration config)
        {
            // Defaults to "none": a fresh copy-exe-and-dll deployment runs unauthenticated until
            // an admin explicitly opts into "jwt" or "plugin".
            var providerName = config["Auth:Provider"] ?? "none";
            return providerName.ToLowerInvariant() switch
            {
                "none" => new NoAuthenticationProvider(),
                "jwt" => new JwtAuthenticationProvider(),
                "plugin" => PluginLoader.Load<IAuthenticationProvider>(config["Auth:PluginAssembly"], config["Auth:PluginType"]),
                _ => throw new InvalidOperationException(
                    $"Unknown Auth:Provider '{providerName}'. Supported: none, jwt, plugin")
            };
        }
    }
}
