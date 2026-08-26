using LogWatcher.Auth.Abstractions;

namespace LogWatcher.Web.Auth
{
    /// <summary>
    /// Authentication fully disabled — for local/test use only. Grants "UserOnly"/"AgentOnly"
    /// policies to every caller without requiring a token.
    /// </summary>
    public class NoAuthenticationProvider : IAuthenticationProvider
    {
        public string ProviderName => "none";

        public void ConfigureServices(IServiceCollection services, IConfiguration config)
        {
            services.AddAuthorization(options =>
            {
                options.AddPolicy("UserOnly", policy => policy.RequireAssertion(_ => true));
                options.AddPolicy("AgentOnly", policy => policy.RequireAssertion(_ => true));
            });
        }

        public void ConfigurePipeline(WebApplication app)
        {
            // No authentication middleware needed: HttpContext.User is always non-null, and the
            // policies above don't inspect it.
            app.UseAuthorization();
        }

        public AuthUiDescriptor GetUiDescriptor(IConfiguration config) => new("none");
    }
}
