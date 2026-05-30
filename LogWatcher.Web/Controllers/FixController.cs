using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;

namespace LogWatcher.Web.Controllers
{
    public record FixValueDto(string Enum, string Description);
    public record FixFieldDto(int Number, string Name, string Type, IReadOnlyList<FixValueDto> Values);

    [ApiController]
    [Route("api/fix")]
    [Authorize(Policy = "UserOnly")]
    public class FixController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public FixController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpGet("fields")]
        public IActionResult GetFields()
        {
            var fixDir = Path.Combine(_env.ContentRootPath, "FixFormat");
            if (!Directory.Exists(fixDir))
                return Ok(new { fields = Array.Empty<FixFieldDto>() });

            var fieldMap = new Dictionary<int, FixFieldDto>();

            foreach (var file in Directory.EnumerateFiles(fixDir, "*.xml"))
            {
                try
                {
                    var doc = XDocument.Load(file);
                    foreach (var f in doc.Descendants("field"))
                    {
                        if (!int.TryParse(f.Attribute("number")?.Value, out var number)) continue;
                        var name = f.Attribute("name")?.Value ?? $"Field{number}";
                        var type = f.Attribute("type")?.Value ?? "STRING";
                        var values = f.Elements("value")
                            .Select(v => new FixValueDto(
                                v.Attribute("enum")?.Value ?? "",
                                v.Attribute("description")?.Value ?? ""))
                            .Where(v => !string.IsNullOrEmpty(v.Enum))
                            .ToList();

                        fieldMap[number] = new FixFieldDto(number, name, type, values);
                    }
                }
                catch { }
            }

            return Ok(new { fields = fieldMap.Values.OrderBy(f => f.Number).ToArray() });
        }
    }
}
