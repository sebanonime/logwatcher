namespace LogWatcher.Web.Config
{
    /// <summary>
    /// Top-level grouping in servers.json.
    /// Perimeter → RootFolder → Server
    /// </summary>
    public class PerimeterDefinition
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public List<RootFolderDefinition> RootFolders { get; set; } = new();
    }

    /// <summary>
    /// A named group of servers that share a common root directory path.
    /// </summary>
    public class RootFolderDefinition
    {
        public string Name { get; set; }
        public List<ServerDefinition> Servers { get; set; } = new();
    }
}
