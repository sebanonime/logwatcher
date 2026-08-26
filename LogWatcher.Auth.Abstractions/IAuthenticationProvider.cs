using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace LogWatcher.Auth.Abstractions
{
    /// <summary>
    /// Extensibility seam for authentication: implement this to plug in a company SSO system
    /// (e.g. an in-house OIDC/SAML provider). The active provider is selected via Auth:Provider
    /// in LogWatcher.Web's appsettings.json ("jwt" | "none" | "plugin").
    ///
    /// Contract a plugin must fulfil:
    ///  - ConfigureServices must register an authentication scheme and two authorization
    ///    policies named exactly "UserOnly" and "AgentOnly" — these are the policies referenced
    ///    by [Authorize(Policy = "...")] on the REST controllers, the SignalR hub and the agent
    ///    gRPC service, regardless of which provider is active.
    ///  - For a "redirect" UI mode (see AuthUiDescriptor), ConfigurePipeline must map the
    ///    login/callback endpoints, and the callback must finish by redirecting the browser to
    ///    "/?token=&lt;jwt&gt;" so the frontend can pick up the token (see App.tsx).
    /// </summary>
    public interface IAuthenticationProvider
    {
        string ProviderName { get; }

        /// <summary>Registers auth services into DI.</summary>
        void ConfigureServices(IServiceCollection services, IConfiguration config);

        /// <summary>Adds auth middleware and/or endpoints to the pipeline.</summary>
        void ConfigurePipeline(WebApplication app);

        /// <summary>Describes how the frontend should present login for this provider.</summary>
        AuthUiDescriptor GetUiDescriptor(IConfiguration config);
    }
}
