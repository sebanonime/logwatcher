using LogWatcher.Web.Config;
using LogWatcher.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LogWatcher.Web.Controllers
{
    [ApiController]
    [Route("api/perimeters")]
    [Authorize(Policy = "UserOnly")]
    public class PerimetersController : ControllerBase
    {
        private readonly ServerConfigRepository _config;
        private readonly IAgentRegistry _agentRegistry;

        public PerimetersController(ServerConfigRepository config, IAgentRegistry agentRegistry)
        {
            _config = config;
            _agentRegistry = agentRegistry;
        }

        /// <summary>Returns the full perimeter → rootFolder → server tree.</summary>
        [HttpGet]
        public IActionResult GetAll()
        {
            var agents = _agentRegistry.GetAll();
            var perimeters = _config.GetAllPerimeters().Select(p => new
            {
                p.Id,
                p.Name,
                RootFolders = p.RootFolders.Select(r => new
                {
                    r.Name,
                    r.EnvironmentColor,
                    Servers = r.Servers.Select(s => new
                    {
                        s.Id, s.Name, s.Type, s.Host, s.AgentId, s.Username,
                        AgentOnline = s.Type == "agent" && agents.Any(a => a.AgentId == s.AgentId)
                    })
                })
            });
            return Ok(perimeters);
        }
    }
}
