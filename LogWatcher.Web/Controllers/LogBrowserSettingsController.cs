using LogWatcher.Web.Config;
using LogWatcher.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LogWatcher.Web.Controllers
{
    [ApiController]
    [Route("api/settings/log-browser")]
    [Authorize(Policy = "UserOnly")]
    public class LogBrowserSettingsController : ControllerBase
    {
        private readonly ServerConfigRepository _servers;
        private readonly IAgentRegistry _agentRegistry;
        private readonly KnownAgentsRepository _knownAgents;

        public LogBrowserSettingsController(ServerConfigRepository servers, IAgentRegistry agentRegistry, KnownAgentsRepository knownAgents)
        {
            _servers = servers;
            _agentRegistry = agentRegistry;
            _knownAgents = knownAgents;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var agents = _agentRegistry.GetAll();
            var result = _servers.GetAllPerimeters().Select(p => new
            {
                p.Id,
                p.Name,
                RootFolders = p.RootFolders.Select(r => new
                {
                    r.Name,
                    r.EnvironmentColor,
                    Servers = r.Servers.Select(s => new
                    {
                        s.Id,
                        s.Name,
                        s.Type,
                        s.Host,
                        s.AgentId,
                        s.Username,
                        s.ShowArchives,
                        AgentOnline = s.Type == "agent" && agents.Any(a => a.AgentId == s.AgentId)
                    })
                })
            });

            return Ok(result);
        }

        [HttpPost("perimeters")]
        public IActionResult CreatePerimeter([FromBody] PerimeterDefinition perimeter)
        {
            if (string.IsNullOrWhiteSpace(perimeter?.Name))
                return BadRequest("Perimeter name is required.");

            if (_servers.GetAllPerimeters().Any(p => string.Equals(p.Name, perimeter.Name, StringComparison.OrdinalIgnoreCase)))
                return BadRequest($"Perimeter '{perimeter.Name}' already exists.");

            if (string.IsNullOrWhiteSpace(perimeter.Id))
                perimeter.Id = Guid.NewGuid().ToString("N")[..8];
            perimeter.RootFolders ??= new List<RootFolderDefinition>();
            _servers.UpsertPerimeter(perimeter);
            return Ok(perimeter);
        }

        [HttpPut("perimeters/{perimeterId}")]
        public IActionResult UpdatePerimeter(string perimeterId, [FromBody] PerimeterDefinition perimeter)
        {
            if (string.IsNullOrWhiteSpace(perimeter?.Name))
                return BadRequest("Perimeter name is required.");

            if (_servers.GetAllPerimeters().Any(p => !string.Equals(p.Id, perimeterId, StringComparison.OrdinalIgnoreCase)
                                                    && string.Equals(p.Name, perimeter.Name, StringComparison.OrdinalIgnoreCase)))
                return BadRequest($"Perimeter '{perimeter.Name}' already exists.");

            perimeter.Id = perimeterId;
            perimeter.RootFolders ??= _servers.GetPerimeter(perimeterId)?.RootFolders ?? new List<RootFolderDefinition>();
            _servers.UpsertPerimeter(perimeter);
            return Ok(perimeter);
        }

        [HttpGet("agents")]
        public IActionResult GetAgents()
        {
            var online = _agentRegistry.GetAll().Select(a => a.AgentId).ToHashSet(StringComparer.OrdinalIgnoreCase);
            return Ok(_knownAgents.GetAll().Select(a => new
            {
                agentId = a.AgentId,
                hostname = a.Hostname,
                lastSeen = a.LastSeen,
                online = online.Contains(a.AgentId),
            }));
        }

        [HttpGet("path-status/{serverId}")]
        public IActionResult GetPathStatus(string serverId)
        {
            var server = _servers.GetById(serverId);
            if (server == null) return NotFound();

            if (server.Type == "agent")
                return Ok(new { online = _agentRegistry.IsConnected(server.AgentId) });

            if (server.Type == "smb")
            {
                var accessible = !string.IsNullOrEmpty(server.Host) && Directory.Exists(server.Host);
                return Ok(new { accessible });
            }

            return Ok(new { });
        }

        [HttpDelete("perimeters/{perimeterId}")]
        public IActionResult DeletePerimeter(string perimeterId)
        {
            return _servers.RemovePerimeter(perimeterId) ? NoContent() : NotFound();
        }

        [HttpPut("perimeters/reorder")]
        public IActionResult ReorderPerimeters([FromBody] List<string> orderedIds)
        {
            return _servers.ReorderPerimeters(orderedIds ?? new List<string>())
                ? NoContent()
                : BadRequest("Ordered id list must contain exactly the current set of perimeter ids.");
        }

        [HttpPut("perimeters/{perimeterId}/roots/reorder")]
        public IActionResult ReorderRoots(string perimeterId, [FromBody] List<string> orderedNames)
        {
            return _servers.ReorderRoots(perimeterId, orderedNames ?? new List<string>())
                ? NoContent()
                : BadRequest("Ordered name list must contain exactly the current set of root names.");
        }

        [HttpPost("perimeters/{perimeterId}/roots")]
        public IActionResult CreateRoot(string perimeterId, [FromBody] RootFolderDefinition root)
        {
            if (string.IsNullOrWhiteSpace(root?.Name))
                return BadRequest("Root name is required.");

            var perimeter = _servers.GetPerimeter(perimeterId);
            if (perimeter == null)
                return NotFound();

            if (perimeter.RootFolders.Any(r => string.Equals(r.Name, root.Name, StringComparison.OrdinalIgnoreCase)))
                return BadRequest($"Root '{root.Name}' already exists.");

            root.Servers ??= new List<ServerDefinition>();
            return Ok(_servers.UpsertRoot(perimeterId, root));
        }

        [HttpPut("perimeters/{perimeterId}/roots/{rootName}")]
        public IActionResult UpdateRoot(string perimeterId, string rootName, [FromBody] RootFolderDefinition root)
        {
            if (string.IsNullOrWhiteSpace(root?.Name))
                return BadRequest("Root name is required.");

            var perimeter = _servers.GetPerimeter(perimeterId);
            if (perimeter == null)
                return NotFound();

            var existing = perimeter.RootFolders.FirstOrDefault(r => string.Equals(r.Name, rootName, StringComparison.OrdinalIgnoreCase));
            if (existing == null)
                return NotFound();

            if (perimeter.RootFolders.Any(r => !string.Equals(r.Name, rootName, StringComparison.OrdinalIgnoreCase)
                                               && string.Equals(r.Name, root.Name, StringComparison.OrdinalIgnoreCase)))
                return BadRequest($"Root '{root.Name}' already exists.");

            var index = perimeter.RootFolders.IndexOf(existing);
            root.Servers = existing.Servers;
            perimeter.RootFolders[index] = root;
            _servers.UpsertPerimeter(perimeter);
            return Ok(root);
        }

        [HttpDelete("perimeters/{perimeterId}/roots/{rootName}")]
        public IActionResult DeleteRoot(string perimeterId, string rootName)
        {
            return _servers.RemoveRoot(perimeterId, rootName) ? NoContent() : NotFound();
        }

        [HttpPost("perimeters/{perimeterId}/roots/{rootName}/paths")]
        public IActionResult CreatePath(string perimeterId, string rootName, [FromBody] ServerDefinition server)
        {
            if (string.IsNullOrWhiteSpace(server?.Name))
                return BadRequest("Path name is required.");

            var perimeter = _servers.GetPerimeter(perimeterId);
            var root = perimeter?.RootFolders.FirstOrDefault(r => string.Equals(r.Name, rootName, StringComparison.OrdinalIgnoreCase));
            if (root == null)
                return NotFound();

            if (root.Servers.Any(s => string.Equals(s.Name, server.Name, StringComparison.OrdinalIgnoreCase)))
                return BadRequest($"Path '{server.Name}' already exists.");

            return Ok(_servers.UpsertServer(perimeterId, rootName, server));
        }

        [HttpPut("perimeters/{perimeterId}/roots/{rootName}/paths/{serverId}")]
        public IActionResult UpdatePath(string perimeterId, string rootName, string serverId, [FromBody] ServerDefinition server)
        {
            if (string.IsNullOrWhiteSpace(server?.Name))
                return BadRequest("Path name is required.");

            var perimeter = _servers.GetPerimeter(perimeterId);
            var root = perimeter?.RootFolders.FirstOrDefault(r => string.Equals(r.Name, rootName, StringComparison.OrdinalIgnoreCase));
            if (root == null)
                return NotFound();

            if (root.Servers.Any(s => !string.Equals(s.Id, serverId, StringComparison.OrdinalIgnoreCase)
                                      && string.Equals(s.Name, server.Name, StringComparison.OrdinalIgnoreCase)))
                return BadRequest($"Path '{server.Name}' already exists.");

            server.Id = serverId;
            return Ok(_servers.UpsertServer(perimeterId, rootName, server));
        }

        [HttpDelete("perimeters/{perimeterId}/roots/{rootName}/paths/{serverId}")]
        public IActionResult DeletePath(string perimeterId, string rootName, string serverId)
        {
            return _servers.RemoveServer(perimeterId, rootName, serverId) ? NoContent() : NotFound();
        }
    }
}