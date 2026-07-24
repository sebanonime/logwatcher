namespace LogWatcher.Web.Config
{
    /// <summary>
    /// A server entry from servers.json.
    /// Type: "smb" | "agent"
    /// </summary>
    public class ServerDefinition
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }  // "smb" | "agent"

        // SMB: UNC base path e.g. \\fileserver\logs
        public string Host { get; set; }

        // Agent: matches AgentId sent by the agent on registration
        public string AgentId { get; set; }

        // SMB: optional username for impersonation
        public string Username { get; set; }

        // Whether .zip/.7z archive files are shown (and browsable) in the log browser for this path.
        public bool ShowArchives { get; set; }
    }
}
