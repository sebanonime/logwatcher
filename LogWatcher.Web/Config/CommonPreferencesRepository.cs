using System.Text.Json;
using LogWatcher.Common;

namespace LogWatcher.Web.Config
{
    public class CommonPreferencesRepository
    {
        private readonly string _filePath;
        private readonly object _lock = new();
        private CommonPreferencesDocument _document;

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNameCaseInsensitive = true,
            WriteIndented = true,
        };

        public CommonPreferencesRepository(IConfiguration config, IWebHostEnvironment env)
        {
            var configuredPath = config["CommonPreferences:Path"];
            _filePath = string.IsNullOrWhiteSpace(configuredPath)
                ? Path.Combine(env.ContentRootPath, "common-preferences.json")
                : (Path.IsPathRooted(configuredPath)
                    ? configuredPath
                    : Path.Combine(env.ContentRootPath, configuredPath));

            _document = Load();
        }

        public CommonPreferencesDocument Get()
        {
            lock (_lock)
            {
                return new CommonPreferencesDocument
                {
                    DefaultHighlights = _document.DefaultHighlights.Select(h => h.Clone()).ToList()
                };
            }
        }

        public void SaveDefaultHighlights(IEnumerable<Highlighting> highlights)
        {
            lock (_lock)
            {
                _document.DefaultHighlights = highlights
                    .OrderBy(h => h.Order)
                    .Select(h => h.Clone())
                    .ToList();
                Save();
            }
        }

        private CommonPreferencesDocument Load()
        {
            if (!File.Exists(_filePath))
                return new CommonPreferencesDocument();

            try
            {
                var json = File.ReadAllText(_filePath);
                return JsonSerializer.Deserialize<CommonPreferencesDocument>(json, JsonOptions)
                       ?? new CommonPreferencesDocument();
            }
            catch
            {
                return new CommonPreferencesDocument();
            }
        }

        private void Save()
        {
            var directory = Path.GetDirectoryName(_filePath);
            if (!string.IsNullOrWhiteSpace(directory))
                Directory.CreateDirectory(directory);

            File.WriteAllText(_filePath, JsonSerializer.Serialize(_document, JsonOptions));
        }
    }
}