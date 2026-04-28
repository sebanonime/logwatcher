using System.Text.Json;

namespace LogWatcher.Web.Config
{
    /// <summary>
    /// Reads and writes the perimeter hierarchy from servers.json.
    /// Structure: Perimeter → RootFolder → Server
    /// </summary>
    public class ServerConfigRepository
    {
        private readonly string _filePath;
        private List<PerimeterDefinition> _perimeters;
        private readonly object _lock = new();

        private static readonly JsonSerializerOptions _jsonOpts = new()
        {
            PropertyNameCaseInsensitive = true,
            WriteIndented = true,
        };

        public ServerConfigRepository(IConfiguration config, IWebHostEnvironment env)
        {
            var configuredPath = config["ServerConfig:Path"];
            if (string.IsNullOrWhiteSpace(configuredPath))
            {
                _filePath = Path.Combine(env.ContentRootPath, "servers.json");
            }
            else
            {
                _filePath = Path.IsPathRooted(configuredPath)
                    ? configuredPath
                    : Path.Combine(env.ContentRootPath, configuredPath);
            }
            _perimeters = Load();
        }

        // ── Perimeter-level ──────────────────────────────────────────────

        public IReadOnlyList<PerimeterDefinition> GetAllPerimeters()
        {
            lock (_lock) return _perimeters.AsReadOnly();
        }

        public PerimeterDefinition GetPerimeter(string perimeterId)
        {
            lock (_lock) return _perimeters.FirstOrDefault(p => p.Id == perimeterId);
        }

        // ── Server-level (flat lookup — needed by WatchSessionManager) ───

        /// <summary>Finds a server by Id across all perimeters and root folders.</summary>
        public ServerDefinition GetById(string serverId)
        {
            lock (_lock)
                return _perimeters
                    .SelectMany(p => p.RootFolders)
                    .SelectMany(r => r.Servers)
                    .FirstOrDefault(s => s.Id == serverId);
        }

        /// <summary>Returns all servers in the given perimeter's root folder.</summary>
        public IReadOnlyList<ServerDefinition> GetServersInRoot(string perimeterId, string rootFolderName)
        {
            lock (_lock)
            {
                var perimeter = _perimeters.FirstOrDefault(p => p.Id == perimeterId);
                var root = perimeter?.RootFolders.FirstOrDefault(r =>
                    string.Equals(r.Name, rootFolderName, StringComparison.OrdinalIgnoreCase));
                return root?.Servers.AsReadOnly() ?? (IReadOnlyList<ServerDefinition>)Array.Empty<ServerDefinition>();
            }
        }

        /// <summary>Returns all servers across all perimeters (for backward compat with ServersController).</summary>
        public IReadOnlyList<ServerDefinition> GetAll()
        {
            lock (_lock)
                return _perimeters
                    .SelectMany(p => p.RootFolders)
                    .SelectMany(r => r.Servers)
                    .ToList()
                    .AsReadOnly();
        }

        // ── Mutations ────────────────────────────────────────────────────

        public void UpsertPerimeter(PerimeterDefinition perimeter)
        {
            lock (_lock)
            {
                var idx = _perimeters.FindIndex(p => p.Id == perimeter.Id);
                if (idx >= 0) _perimeters[idx] = perimeter;
                else _perimeters.Add(perimeter);
                Save();
            }
        }

        public bool RemovePerimeter(string perimeterId)
        {
            lock (_lock)
            {
                int removed = _perimeters.RemoveAll(p => p.Id == perimeterId);
                if (removed > 0) Save();
                return removed > 0;
            }
        }

        public RootFolderDefinition UpsertRoot(string perimeterId, RootFolderDefinition root)
        {
            lock (_lock)
            {
                var perimeter = _perimeters.FirstOrDefault(p => p.Id == perimeterId);
                if (perimeter == null)
                    throw new InvalidOperationException($"Perimeter '{perimeterId}' not found.");

                var existing = perimeter.RootFolders.FirstOrDefault(r =>
                    string.Equals(r.Name, root.Name, StringComparison.OrdinalIgnoreCase));
                if (existing == null)
                {
                    existing = new RootFolderDefinition { Name = root.Name };
                    perimeter.RootFolders.Add(existing);
                }

                existing.Name = root.Name;
                existing.Servers ??= new List<ServerDefinition>();
                Save();
                return existing;
            }
        }

        public bool RemoveRoot(string perimeterId, string rootName)
        {
            lock (_lock)
            {
                var perimeter = _perimeters.FirstOrDefault(p => p.Id == perimeterId);
                if (perimeter == null)
                    return false;

                var removed = perimeter.RootFolders.RemoveAll(r =>
                    string.Equals(r.Name, rootName, StringComparison.OrdinalIgnoreCase));
                if (removed > 0)
                    Save();
                return removed > 0;
            }
        }

        public ServerDefinition UpsertServer(string perimeterId, string rootName, ServerDefinition server)
        {
            lock (_lock)
            {
                var perimeter = _perimeters.FirstOrDefault(p => p.Id == perimeterId);
                var root = perimeter?.RootFolders.FirstOrDefault(r =>
                    string.Equals(r.Name, rootName, StringComparison.OrdinalIgnoreCase));
                if (root == null)
                    throw new InvalidOperationException($"Root '{rootName}' not found in perimeter '{perimeterId}'.");

                if (string.IsNullOrWhiteSpace(server.Id))
                    server.Id = Guid.NewGuid().ToString("N")[..8];

                var existingIndex = root.Servers.FindIndex(s => s.Id == server.Id);
                if (existingIndex >= 0)
                    root.Servers[existingIndex] = server;
                else
                    root.Servers.Add(server);

                Save();
                return server;
            }
        }

        public bool RemoveServer(string perimeterId, string rootName, string serverId)
        {
            lock (_lock)
            {
                var perimeter = _perimeters.FirstOrDefault(p => p.Id == perimeterId);
                var root = perimeter?.RootFolders.FirstOrDefault(r =>
                    string.Equals(r.Name, rootName, StringComparison.OrdinalIgnoreCase));
                if (root == null)
                    return false;

                var removed = root.Servers.RemoveAll(s => s.Id == serverId);
                if (removed > 0)
                    Save();
                return removed > 0;
            }
        }

        // ── Persistence ──────────────────────────────────────────────────

        private List<PerimeterDefinition> Load()
        {
            if (!File.Exists(_filePath))
                return Seed();

            try
            {
                var json = File.ReadAllText(_filePath);

                // Support legacy flat format (array of ServerDefinition)
                using var doc = JsonDocument.Parse(json);
                var root = doc.RootElement;
                if (root.ValueKind == JsonValueKind.Array && root.GetArrayLength() > 0)
                {
                    var first = root.EnumerateArray().First();
                    // New format has "rootFolders"; old format has "type"
                    if (first.TryGetProperty("rootFolders", out _) ||
                        first.TryGetProperty("RootFolders", out _))
                    {
                        return JsonSerializer.Deserialize<List<PerimeterDefinition>>(json, _jsonOpts)
                               ?? Seed();
                    }
                    else
                    {
                        // Migrate legacy flat list → single perimeter
                        var servers = JsonSerializer.Deserialize<List<ServerDefinition>>(json, _jsonOpts)
                                      ?? new List<ServerDefinition>();
                        return MigrateLegacy(servers);
                    }
                }

                return Seed();
            }
            catch
            {
                return Seed();
            }
        }

        private static List<PerimeterDefinition> Seed() =>
            new()
            {
                new PerimeterDefinition
                {
                    Id = "default",
                    Name = "Default",
                    RootFolders = new List<RootFolderDefinition>
                    {
                        new RootFolderDefinition
                        {
                            Name = "Local",
                            Servers = new List<ServerDefinition>
                            {
                                new ServerDefinition { Id = "local", Name = "Local", Type = "local" }
                            }
                        }
                    }
                }
            };

        private static List<PerimeterDefinition> MigrateLegacy(List<ServerDefinition> servers) =>
            new()
            {
                new PerimeterDefinition
                {
                    Id = "default",
                    Name = "Default",
                    RootFolders = new List<RootFolderDefinition>
                    {
                        new RootFolderDefinition { Name = "Servers", Servers = servers }
                    }
                }
            };

        private void Save()
        {
            var json = JsonSerializer.Serialize(_perimeters, _jsonOpts);
            File.WriteAllText(_filePath, json);
        }
    }
}
