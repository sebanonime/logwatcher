using System.Text.Json;

namespace LogWatcher.Web.Config
{
    public class KnownAgentDefinition
    {
        public string AgentId { get; set; }
        public string Hostname { get; set; }
        public DateTimeOffset LastSeen { get; set; }
    }

    public class KnownAgentsRepository
    {
        private readonly string _filePath;
        private List<KnownAgentDefinition> _agents;
        private readonly object _lock = new();

        private static readonly JsonSerializerOptions _jsonOpts = new()
        {
            PropertyNameCaseInsensitive = true,
            WriteIndented = true,
        };

        public KnownAgentsRepository(IWebHostEnvironment env)
        {
            _filePath = Path.Combine(env.ContentRootPath, "known-agents.json");
            _agents = Load();
        }

        public IReadOnlyList<KnownAgentDefinition> GetAll()
        {
            lock (_lock) return _agents.AsReadOnly();
        }

        public void Upsert(string agentId, string hostname)
        {
            lock (_lock)
            {
                var existing = _agents.FirstOrDefault(a => a.AgentId == agentId);
                if (existing != null)
                {
                    existing.Hostname = hostname;
                    existing.LastSeen = DateTimeOffset.UtcNow;
                }
                else
                {
                    _agents.Add(new KnownAgentDefinition
                    {
                        AgentId = agentId,
                        Hostname = hostname,
                        LastSeen = DateTimeOffset.UtcNow,
                    });
                }
                Save();
            }
        }

        private List<KnownAgentDefinition> Load()
        {
            if (!File.Exists(_filePath)) return new();
            try
            {
                var json = File.ReadAllText(_filePath);
                return JsonSerializer.Deserialize<List<KnownAgentDefinition>>(json, _jsonOpts) ?? new();
            }
            catch { return new(); }
        }

        private void Save()
        {
            var json = JsonSerializer.Serialize(_agents, _jsonOpts);
            File.WriteAllText(_filePath, json);
        }
    }
}
