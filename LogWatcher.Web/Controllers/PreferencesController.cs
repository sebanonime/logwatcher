using LogWatcher.Common;
using LogWatcher.Web.Config;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LogWatcher.Web.Controllers
{
    [ApiController]
    [Route("api/settings/preferences")]
    [Authorize(Policy = "UserOnly")]
    public class PreferencesController : ControllerBase
    {
        private readonly CommonPreferencesRepository _commonPreferences;
        private readonly ProfileRepository _profiles;

        public PreferencesController(CommonPreferencesRepository commonPreferences, ProfileRepository profiles)
        {
            _commonPreferences = commonPreferences;
            _profiles = profiles;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new
            {
                DefaultHighlights = _commonPreferences.Get().DefaultHighlights,
                Profiles = _profiles.GetAll()
            });
        }

        [HttpPut]
        public IActionResult SaveAll([FromBody] PreferencesPayload payload)
        {
            payload ??= new PreferencesPayload();
            var highlights = payload.DefaultHighlights ?? new List<Highlighting>();
            var profiles = payload.Profiles ?? new List<Profile>();

            _commonPreferences.SaveDefaultHighlights(highlights);
            _profiles.ReplaceAll(profiles);

            return Ok(new
            {
                DefaultHighlights = highlights,
                Profiles = _profiles.GetAll()
            });
        }

        [HttpPut("default-highlights")]
        public IActionResult SaveDefaultHighlights([FromBody] List<Highlighting> highlights)
        {
            _commonPreferences.SaveDefaultHighlights(highlights ?? new List<Highlighting>());
            return Ok();
        }

        [HttpPost("profiles")]
        public IActionResult CreateProfile([FromBody] Profile profile)
        {
            _profiles.Upsert(profile);
            return Ok(profile);
        }

        [HttpPut("profiles/{name}")]
        public IActionResult UpdateProfile(string name, [FromBody] Profile profile)
        {
            if (string.IsNullOrWhiteSpace(profile.Name))
                profile.Name = name;

            _profiles.Upsert(profile, name);
            return Ok(profile);
        }

        [HttpDelete("profiles/{name}")]
        public IActionResult DeleteProfile(string name)
        {
            return _profiles.Delete(name) ? Ok() : NotFound();
        }

        public class PreferencesPayload
        {
            public List<Highlighting> DefaultHighlights { get; set; } = new();
            public List<Profile> Profiles { get; set; } = new();
        }
    }
}