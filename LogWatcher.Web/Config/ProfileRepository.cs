using System.Xml.Linq;
using System.Xml.Serialization;
using LogWatcher.Common;

namespace LogWatcher.Web.Config
{
    public class ProfileRepository
    {
        private readonly string _folderPath;
        private readonly XmlSerializer _serializer = new(typeof(Profile));
        private readonly object _lock = new();

        // Maps old WinForms XmlCustomSerializer_old1 fully-qualified element names → simple names
        private static readonly Dictionary<string, string> _oldFormatNameMap = new()
        {
            ["LogWatcher.Common.Profile"] = "Profile",
            ["LogWatcher.Common.Highlighting"] = "Highlighting",
            ["LogWatcher.Common.HiddenLine"] = "HiddenLine",
            ["LogWatcher.Common.StoredFilter"] = "StoredFilter",
        };

        public ProfileRepository(IConfiguration config, IWebHostEnvironment env)
        {
            var configuredPath = config["ProfileStore:Path"];
            _folderPath = string.IsNullOrWhiteSpace(configuredPath)
                ? Path.Combine(env.ContentRootPath, "Profile")
                : (Path.IsPathRooted(configuredPath)
                    ? configuredPath
                    : Path.Combine(env.ContentRootPath, configuredPath));

            Directory.CreateDirectory(_folderPath);
        }

        public IReadOnlyList<Profile> GetAll()
        {
            lock (_lock)
            {
                return Directory.GetFiles(_folderPath, "*.lwp")
                    .Select(ReadProfile)
                    .Where(profile => profile != null)
                    .OrderBy(profile => profile.Name, StringComparer.OrdinalIgnoreCase)
                    .ToList();
            }
        }

        public Profile Get(string name)
        {
            lock (_lock)
            {
                var path = GetProfilePath(name);
                return File.Exists(path) ? ReadProfile(path) : null;
            }
        }

        public void Upsert(Profile profile, string originalName = null)
        {
            ArgumentNullException.ThrowIfNull(profile);
            if (string.IsNullOrWhiteSpace(profile.Name))
                throw new ArgumentException("Profile name is required.", nameof(profile));

            lock (_lock)
            {
                profile.DicoHighLighting ??= new List<Highlighting>();
                profile.DicoHiddenLog ??= new List<HiddenLine>();
                profile.DicoStoredFilter ??= new List<StoredFilter>();
                profile.DicoHighLighting = profile.DicoHighLighting.OrderBy(h => h.Order).ToList();

                if (!string.IsNullOrWhiteSpace(originalName) &&
                    !string.Equals(originalName, profile.Name, StringComparison.OrdinalIgnoreCase))
                {
                    var originalPath = GetProfilePath(originalName);
                    if (File.Exists(originalPath))
                        File.Delete(originalPath);
                }

                using var writer = new StreamWriter(GetProfilePath(profile.Name), false);
                _serializer.Serialize(writer, profile);
            }
        }

        public bool Delete(string name)
        {
            lock (_lock)
            {
                var path = GetProfilePath(name);
                if (!File.Exists(path))
                    return false;

                File.Delete(path);
                return true;
            }
        }

        public void ReplaceAll(IEnumerable<Profile> profiles)
        {
            ArgumentNullException.ThrowIfNull(profiles);

            lock (_lock)
            {
                var normalized = profiles
                    .Where(p => p != null && !string.IsNullOrWhiteSpace(p.Name))
                    .GroupBy(p => p.Name.Trim(), StringComparer.OrdinalIgnoreCase)
                    .Select(group => group.Last())
                    .ToList();

                var desiredNames = new HashSet<string>(normalized.Select(p => p.Name), StringComparer.OrdinalIgnoreCase);
                foreach (var path in Directory.GetFiles(_folderPath, "*.lwp"))
                {
                    var existingName = Path.GetFileNameWithoutExtension(path);
                    if (!desiredNames.Contains(existingName))
                        File.Delete(path);
                }

                foreach (var profile in normalized)
                {
                    Upsert(profile);
                }
            }
        }

        private Profile ReadProfile(string path)
        {
            try
            {
                using var reader = new StreamReader(path);
                return (Profile)_serializer.Deserialize(reader);
            }
            catch
            {
                // Fallback: try old WinForms XmlCustomSerializer_old1 format
                try { return ReadOldFormatProfile(path); }
                catch (Exception ex) { return null; }
            }
        }

        // Old format uses fully-qualified type names as element names (e.g. <LogWatcher.Common.Profile>).
        // Transform those to the simple names that XmlSerializer expects, then deserialize normally.
        // Also normalizes boolean values: WinForms serializer outputs "True"/"False" (Pascal case)
        // but XmlSerializer requires XSD booleans "true"/"false" (lowercase).
        private Profile ReadOldFormatProfile(string path)
        {
            // WinForms serializer writes with Encoding.Default (ANSI) but declares encoding="utf-16".
            // Reading as text first avoids the byte-stream encoding mismatch in XDocument.Load.
            var content = File.ReadAllText(path, System.Text.Encoding.Default);
            var doc = XDocument.Parse(content);
            if (doc.Root == null) return null;
            TransformOldFormatNames(doc.Root);
            NormalizeLegacyBooleans(doc.Root);
            using var ms = new MemoryStream();
            doc.Save(ms);
            ms.Position = 0;
            using var reader = new StreamReader(ms);
            return (Profile)_serializer.Deserialize(reader);
        }

        private static void TransformOldFormatNames(XElement element)
        {
            if (_oldFormatNameMap.TryGetValue(element.Name.LocalName, out var newName))
                element.Name = newName;
            foreach (var child in element.Elements().ToList())
                TransformOldFormatNames(child);
        }

        private static void NormalizeLegacyBooleans(XElement element)
        {
            if (!element.HasElements)
            {
                if (element.Value == "True") element.Value = "true";
                else if (element.Value == "False") element.Value = "false";
            }
            else
            {
                foreach (var child in element.Elements())
                    NormalizeLegacyBooleans(child);
            }
        }

        private string GetProfilePath(string name)
        {
            var invalidChars = Path.GetInvalidFileNameChars();
            var sanitized = new string(name.Where(ch => !invalidChars.Contains(ch)).ToArray());
            if (string.IsNullOrWhiteSpace(sanitized))
                sanitized = "profile";

            return Path.Combine(_folderPath, $"{sanitized}.lwp");
        }
    }
}