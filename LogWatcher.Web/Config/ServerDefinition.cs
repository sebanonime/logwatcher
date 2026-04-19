namespace LogWatcher.Web.Config
{
    /// <summary>
    /// A server entry from servers.json.
    /// Type: "local" | "smb" | "agent"
    /// </summary>
    public class ServerDefinition
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }  // "local" | "smb" | "agent"

        // SMB: UNC base path e.g. \\fileserver\logs
        public string Host { get; set; }

        // Agent: matches AgentId sent by the agent on registration
        public string AgentId { get; set; }

        // SMB: optional username for impersonation
        public string Username { get; set; }
    }
}
