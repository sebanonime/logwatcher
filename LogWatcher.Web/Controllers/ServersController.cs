using LogWatcher.Web.Config;
using LogWatcher.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LogWatcher.Web.Controllers
{
    [ApiController]
    [Route("api/servers")]
    [Authorize(Policy = "UserOnly")]
    public class ServersController : ControllerBase
    {
        private readonly ServerConfigRepository _servers;
        private readonly IAgentRegistry _agentRegistry;
        private readonly IConfiguration _config;

        public ServersController(ServerConfigRepository servers, IAgentRegistry agentRegistry, IConfiguration config)
        {
            _servers = servers;
            _agentRegistry = agentRegistry;
            _config = config;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var all = _servers.GetAll();
            var agents = _agentRegistry.GetAll();
            var result = all.Select(s => new
            {
                s.Id, s.Name, s.Type, s.Host, s.AgentId, s.Username,
                AgentOnline = s.Type == "agent" && agents.Any(a => a.AgentId == s.AgentId)
            });
            return Ok(result);
        }

        [HttpPost]
        public IActionResult Create([FromBody] ServerDefinition server)
        {
            // For now create a single-server perimeter — full server manager UI is a future phase
            if (string.IsNullOrWhiteSpace(server.Id))
                server.Id = Guid.NewGuid().ToString("N")[..8];

            var perimeter = new PerimeterDefinition
            {
                Id = server.Id,
                Name = server.Name,
                RootFolders = new List<RootFolderDefinition>
                {
                    new RootFolderDefinition
                    {
                        Name = "Default",
                        Servers = new List<ServerDefinition> { server }
                    }
                }
            };
            _servers.UpsertPerimeter(perimeter);
            return Ok(server);
        }

        [HttpPut("{id}")]
        public IActionResult Update(string id, [FromBody] ServerDefinition server)
        {
            server.Id = id;
            // Find the perimeter that contains this server and update it
            var perimeter = _servers.GetAllPerimeters()
                .FirstOrDefault(p => p.RootFolders.Any(r => r.Servers.Any(s => s.Id == id)));
            if (perimeter == null) return NotFound();

            foreach (var root in perimeter.RootFolders)
            {
                var idx = root.Servers.FindIndex(s => s.Id == id);
                if (idx >= 0) { root.Servers[idx] = server; break; }
            }
            _servers.UpsertPerimeter(perimeter);
            return Ok(server);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            var perimeter = _servers.GetAllPerimeters()
                .FirstOrDefault(p => p.RootFolders.Any(r => r.Servers.Any(s => s.Id == id)));
            if (perimeter == null) return NotFound();

            foreach (var root in perimeter.RootFolders)
                root.Servers.RemoveAll(s => s.Id == id);
            _servers.UpsertPerimeter(perimeter);
            return Ok();
        }

        /// <summary>
        /// Generates a one-time agent JWT for the given server.
        /// The admin copies this token into the agent's appsettings.json.
        /// </summary>
        [HttpPost("{id}/agent-token")]
        public IActionResult GenerateAgentToken(string id)
        {
            var server = _servers.GetById(id);
            if (server == null) return NotFound();
            if (server.Type != "agent") return BadRequest("Server is not of type 'agent'.");

            var secret = _config["Jwt:AgentSecret"]
                ?? throw new InvalidOperationException("Jwt:AgentSecret not configured.");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: new[]
                {
                    new Claim("sub", server.AgentId ?? server.Id),
                    new Claim("role", "agent"),
                    new Claim("serverId", server.Id)
                },
                signingCredentials: creds
                // No expiry — agent tokens are long-lived machine secrets
            );

            return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
        }
    }
}
