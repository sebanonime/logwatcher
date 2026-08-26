namespace LogWatcher.Auth.Abstractions
{
    /// <summary>
    /// Tells the frontend how to present login for the currently active provider.
    /// Mode "password": POST username/password to /api/auth/login (today's built-in flow).
    /// Mode "redirect": navigate the browser to LoginUrl (company SSO); the plugin's own
    /// callback endpoint redirects back to "/?token=&lt;jwt&gt;" when done.
    /// Mode "none": authentication is disabled, skip the login screen entirely.
    /// </summary>
    public record AuthUiDescriptor(string Mode, string? LoginUrl = null, string? LogoutUrl = null);
}
