using LogWatcher.Agent;
using LogWatcher.Agent.Auth;
using LogWatcher.Common.Auth;
using NLog;
using NLog.Web;

// 1. Activer les exceptions pour détecter immédiatement une erreur dans nlog.json
LogManager.ThrowExceptions = true;

// 2. Charger la configuration
var logger = LogManager.Setup()
    .LoadConfigurationFromFile("NLog.config")
    .GetCurrentClassLogger();

try
{
    logger.Info("Starting LogWatcher Agent...");

    IHost host = Host.CreateDefaultBuilder(args)
        .UseWindowsService(options =>
        {
            options.ServiceName = "LogWatcher Agent";
        })
        .UseSystemd()
        .ConfigureLogging(logging =>
        {
            // 3. Supprimer les providers natifs pour éviter que appsettings.json ne filtre les logs
            logging.ClearProviders(); 
        })
        .UseNLog() // NLog prend le relais pour la console ET les fichiers
        .ConfigureAppConfiguration((ctx, cfg) =>
        {
            cfg.AddJsonFile("appsettings.json", optional: false, reloadOnChange: false);
            cfg.AddJsonFile($"appsettings.{ctx.HostingEnvironment.EnvironmentName}.json", optional: true);
            cfg.AddEnvironmentVariables();
        })
        .ConfigureServices((context, services) =>
        {
            var credentialProvider = AgentCredentialProviderFactory.Create(context.Configuration);
            if (credentialProvider is NoAgentCredentialProvider)
                logger.Warn("Authentication is DISABLED (Agent:AuthProvider=none) — do not use in production.");

            services.AddSingleton<IAgentCredentialProvider>(credentialProvider);
            services.AddSingleton<AgentLineIndex>();
            services.AddTransient<AgentGrpcClient>();
            services.AddHostedService<AgentWorker>();
        })
        .Build();

    await host.RunAsync();
}
catch (Exception ex)
{
    logger.Error(ex, "L'application s'est arrêtée suite à une exception non gérée.");
    throw;
}
finally
{
    // 4. S'assurer que tous les logs restants en mémoire sont écrits dans le fichier avant de quitter
    LogManager.Shutdown();
}