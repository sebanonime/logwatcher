using LogWatcher.Web.Auth;
using LogWatcher.Web.Config;
using LogWatcher.Web.Hubs;
using LogWatcher.Web.Services;
using LogWatcher.Web.Sessions;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

// ── Authentication (extensible via Auth:Provider) ──────────────────────────
var authProvider = AuthProviderFactory.Create(config);
authProvider.ConfigureServices(builder.Services, config);

// ── Core services ──────────────────────────────────────────────────────────
builder.Services.AddDataProtection();
builder.Services.AddSingleton<CredentialStore>();
builder.Services.AddSingleton<ServerConfigRepository>();
builder.Services.AddSingleton<IAgentRegistry, AgentRegistry>();
builder.Services.AddSingleton<WatchSessionManager>();

// ── SignalR ────────────────────────────────────────────────────────────────
builder.Services.AddSignalR(opts =>
{
    opts.MaximumReceiveMessageSize = 1024 * 1024; // 1 MB
    opts.EnableDetailedErrors = builder.Environment.IsDevelopment();
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

// ── Pipeline ───────────────────────────────────────────────────────────────
if (app.Environment.IsDevelopment())
    app.UseCors("DevCors");

app.UseHttpsRedirection();

authProvider.ConfigurePipeline(app);

app.MapControllers();
app.MapHub<LogHub>("/logHub");
app.MapHub<AgentHub>("/agentHub");

// Serve React frontend static files in production
app.UseDefaultFiles();
app.UseStaticFiles();
app.MapFallbackToFile("index.html");

app.Run();
