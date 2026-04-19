using System.Security.Claims;

namespace LogWatcher.Web.Auth
{
    /// <summary>
    /// Extensibility seam for user authentication.
    /// The current implementation is JWT (see JwtAuthenticationProvider).
    /// To add company auth (OIDC, LDAP, SAML): implement this interface and
    /// change Auth:Provider in appsettings.json.
    ///
    /// Note: agent authentication is always JWT regardless of which
    /// IAuthenticationProvider is active — agents are machine identities.
    /// </summary>
    public interface IAuthenticationProvider
    {
        string ProviderName { get; }

        /// <summary>Registers auth services into DI.</summary>
        void ConfigureServices(IServiceCollection services, IConfiguration config);

        /// <summary>Adds auth middleware to the pipeline.</summary>
        void ConfigurePipeline(IApplicationBuilder app);
    }
}
