using Microsoft.AspNetCore.DataProtection;
using System.Text.Json;

namespace LogWatcher.Web.Config
{
    /// <summary>
    /// Stores and retrieves credentials encrypted with ASP.NET Core Data Protection.
    /// Keys are never written in plaintext — the encrypted JSON is stored in credentials.enc.
    /// </summary>
    public class CredentialStore
    {
        private readonly IDataProtector _protector;
        private readonly string _filePath;
        private Dictionary<string, string> _cache;
        private readonly object _lock = new();

        public CredentialStore(IDataProtectionProvider dataProtection, IConfiguration config)
        {
            _protector = dataProtection.CreateProtector("LogWatcher.Credentials.v1");
            _filePath = config["CredentialStore:Path"] ?? Path.Combine(AppContext.BaseDirectory, "credentials.enc");
            _cache = Load();
        }

        public void Set(string key, string value)
        {
            lock (_lock)
            {
                _cache[key] = value;
                Save();
            }
        }

        public string Get(string key)
        {
            lock (_lock)
            {
                return _cache.TryGetValue(key, out var val) ? val : null;
            }
        }

        public void Remove(string key)
        {
            lock (_lock)
            {
                _cache.Remove(key);
                Save();
            }
        }

        private Dictionary<string, string> Load()
        {
            if (!File.Exists(_filePath))
                return new Dictionary<string, string>();
            try
            {
                var encrypted = File.ReadAllText(_filePath);
                var json = _protector.Unprotect(encrypted);
                return JsonSerializer.Deserialize<Dictionary<string, string>>(json)
                       ?? new Dictionary<string, string>();
            }
            catch
            {
                return new Dictionary<string, string>();
            }
        }

        private void Save()
        {
            var json = JsonSerializer.Serialize(_cache);
            var encrypted = _protector.Protect(json);
            File.WriteAllText(_filePath, encrypted);
        }
    }
}
