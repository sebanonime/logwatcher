using LogWatcher.Auth.Abstractions;
using LogWatcher.Web.Auth;
using LogWatcher.Web.Config;
using LogWatcher.Web.Hubs;
using LogWatcher.Web.Services;
using LogWatcher.Web.Sessions;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using NLog.Web;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

// ── Logging (NLog) ─────────────────────────────────────────────────────────
builder.Logging.ClearProviders();
builder.Host.UseNLog();

// ── gRPC dedicated port ───────────────────────────────────────────────────────
int grpcPort = config.GetValue<int>("Agent:GrpcListeningPort", 0);
bool grpcInsecure = config.GetValue<bool>("Agent:GrpcAllowInsecure", false);

if (grpcPort > 0 && grpcInsecure)
{
    builder.WebHost.ConfigureKestrel((ctx, kestrel) =>
    {
        // Explicit Kestrel Listen* overrides ASPNETCORE_URLS, so we re-apply the existing web URLs.
        var webUrls = (Environment.GetEnvironmentVariable("ASPNETCORE_URLS") ?? "")
            .Split(';', StringSplitOptions.RemoveEmptyEntries);

        foreach (var url in webUrls)
        {
            try
            {
                var uri = new Uri(url.Trim());
                if (uri.Scheme == "https")
                    kestrel.ListenAnyIP(uri.Port, o => o.UseHttps());
                else
                    kestrel.ListenAnyIP(uri.Port);
            }
            catch { }
        }

        // Fallback to launchSettings defaults when running outside dotnet run
        if (webUrls.Length == 0)
        {
            kestrel.ListenLocalhost(7123, o => o.UseHttps());
            kestrel.ListenLocalhost(5031);
        }

        // Dedicated HTTP/2 cleartext endpoint for gRPC agents
        kestrel.ListenAnyIP(grpcPort, o => o.Protocols = HttpProtocols.Http2);

        // HTTP/2 keepalive: without this, a long-lived, mostly-idle duplex stream between a
        // remote agent and this backend can be silently dropped by NAT/firewalls on a real
        // network (works fine over loopback, which is why this can be invisible in local testing).
        kestrel.Limits.Http2.KeepAlivePingDelay = TimeSpan.FromSeconds(30);
        kestrel.Limits.Http2.KeepAlivePingTimeout = TimeSpan.FromSeconds(20);
    });
}

// ── Authentication (extensible via Auth:Provider) ──────────────────────────
var authProvider = AuthProviderFactory.Create(config);
authProvider.ConfigureServices(builder.Services, config);
builder.Services.AddSingleton<IAuthenticationProvider>(authProvider);

if (authProvider.ProviderName == "none")
    NLog.LogManager.GetCurrentClassLogger().Warn("Authentication is DISABLED (Auth:Provider=none) — do not use in production.");

// ── Core services ──────────────────────────────────────────────────────────
builder.Services.AddDataProtection();
builder.Services.AddSingleton<CredentialStore>();
builder.Services.AddSingleton<ServerConfigRepository>();
builder.Services.AddSingleton<CommonPreferencesRepository>();
builder.Services.AddSingleton<ProfileRepository>();
builder.Services.AddSingleton<KnownAgentsRepository>();
builder.Services.AddSingleton<IAgentRegistry, AgentRegistry>();
builder.Services.AddSingleton<ContentSearchService>();
builder.Services.AddSingleton<WatchSessionManager>();

// ── gRPC (agent ↔ backend) ────────────────────────────────────────────────
// Default MaxReceiveMessageSize (4MB) is too small for an agent's initial-load PushLines
// batch on a large log file (thousands of lines in one message) — raise it well above what
// a single chunk from AgentFileWatcher can produce.
builder.Services.AddGrpc(options =>
{
    options.MaxReceiveMessageSize = 32 * 1024 * 1024;
    options.MaxSendMessageSize = 32 * 1024 * 1024;
});

// ── SignalR (browser ↔ backend) ───────────────────────────────────────────
builder.Services.AddSignalR(opts =>
{
    opts.MaximumReceiveMessageSize = 1024 * 1024; // 1 MB
    opts.EnableDetailedErrors = builder.Environment.IsDevelopment();
    // Envoie un ping ping "keep-alive" toutes les 15 secondes
    opts.KeepAliveInterval = TimeSpan.FromSeconds(15);
    
    // Considère le client déconnecté s'il ne répond pas pendant 30 secondes
    opts.ClientTimeoutInterval = TimeSpan.FromSeconds(30);
})
.AddJsonProtocol(opts =>
{
    opts.PayloadSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});

// ── Controllers + CORS (dev: allow Vite dev server) ───────────────────────
builder.Services.AddControllers();
builder.Services.AddCors(opts =>
{
    opts.AddPolicy("DevCors", policy =>
        policy.WithOrigins("http://localhost:5173")   // Vite default
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

var app = builder.Build();

// ── HTTPS redirect (disabled for insecure gRPC mode — redirect breaks H2C) ─
if (!grpcInsecure)
    app.UseHttpsRedirection();

// ── Add HTTPS gRPC port to existing URLs (secure mode only) ──────────────
if (grpcPort > 0 && !grpcInsecure)
    app.Urls.Add($"https://0.0.0.0:{grpcPort}");

// ── Pipeline ───────────────────────────────────────────────────────────────
if (app.Environment.IsDevelopment())
    app.UseCors("DevCors");

authProvider.ConfigurePipeline(app);

app.MapControllers();
app.MapHub<LogHub>("/logHub");
app.MapGrpcService<AgentGrpcService>();

// Serve React frontend static files in production
app.UseDefaultFiles();
app.UseStaticFiles();
app.MapFallbackToFile("index.html");

// ── Startup info ───────────────────────────────────────────────────────────
app.Lifetime.ApplicationStarted.Register(() =>
{
    if (grpcPort > 0)
    {
        var scheme = grpcInsecure ? "http" : "https";
        Console.WriteLine();
        Console.WriteLine($"  [Agent gRPC]  {scheme}://{{YOUR_HOST}}:{grpcPort}");
        Console.WriteLine($"  [Agent gRPC]  Mode : {(grpcInsecure ? "HTTP/2 cleartext (insecure)" : "HTTPS")}");
        Console.WriteLine();
    }
});

try
{
    app.Run();
}
catch (Exception ex)
{
    NLog.LogManager.GetCurrentClassLogger().Fatal(ex, "Application stopped because of an exception");
    throw;
}
finally
{
    NLog.LogManager.Shutdown();
}
