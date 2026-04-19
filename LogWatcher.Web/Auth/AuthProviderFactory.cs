namespace LogWatcher.Web.Auth
{
    /// <summary>
    /// Resolves the active IAuthenticationProvider based on Auth:Provider in config.
    /// Adding a new provider: implement IAuthenticationProvider and register it here.
    /// </summary>
    public static class AuthProviderFactory
    {
        public static IAuthenticationProvider Create(IConfiguration config)
        {
            var providerName = config["Auth:Provider"] ?? "jwt";
            return providerName.ToLowerInvariant() switch
            {
                "jwt" => new JwtAuthenticationProvider(),
                // Future: "oidc" => new OidcAuthenticationProvider(),
                // Future: "ldap" => new LdapAuthenticationProvider(),
                _ => throw new InvalidOperationException(
                    $"Unknown Auth:Provider '{providerName}'. Supported: jwt")
            };
        }
    }
}
