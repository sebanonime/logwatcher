using System;
using System.IO;
using System.Linq;
using System.Reflection;

namespace LogWatcher.Common.Auth
{
    /// <summary>
    /// Loads a company-provided auth plugin assembly by explicit path (from appsettings), and
    /// instantiates the type implementing <typeparamref name="T"/>. Shared by the Web
    /// (IAuthenticationProvider) and Agent (IAgentCredentialProvider) plugin factories.
    /// </summary>
    public static class PluginLoader
    {
        public static T Load<T>(string? assemblyPath, string? typeName) where T : class
        {
            if (string.IsNullOrWhiteSpace(assemblyPath))
                throw new InvalidOperationException(
                    $"Plugin assembly path not configured. Set the PluginAssembly setting to load an {typeof(T).Name}.");

            var fullPath = Path.IsPathRooted(assemblyPath)
                ? assemblyPath
                : Path.Combine(AppContext.BaseDirectory, assemblyPath);

            if (!File.Exists(fullPath))
                throw new InvalidOperationException($"Plugin assembly not found at '{fullPath}'.");

            Assembly assembly;
            try
            {
                assembly = Assembly.LoadFrom(fullPath);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Failed to load plugin assembly '{fullPath}': {ex.Message}", ex);
            }

            Type? type;
            if (!string.IsNullOrWhiteSpace(typeName))
            {
                type = assembly.GetType(typeName, throwOnError: false);
                if (type is null)
                    throw new InvalidOperationException($"Type '{typeName}' not found in plugin assembly '{fullPath}'.");
                if (!typeof(T).IsAssignableFrom(type))
                    throw new InvalidOperationException($"Type '{typeName}' in '{fullPath}' does not implement {typeof(T).Name}.");
            }
            else
            {
                var candidates = assembly.GetTypes()
                    .Where(t => t is { IsClass: true, IsAbstract: false, IsPublic: true } && typeof(T).IsAssignableFrom(t))
                    .ToList();

                if (candidates.Count == 0)
                    throw new InvalidOperationException($"No public type implementing {typeof(T).Name} found in plugin assembly '{fullPath}'.");
                if (candidates.Count > 1)
                    throw new InvalidOperationException(
                        $"Multiple types implementing {typeof(T).Name} found in plugin assembly '{fullPath}' " +
                        $"({string.Join(", ", candidates.Select(c => c.FullName))}); set PluginType to disambiguate.");

                type = candidates[0];
            }

            try
            {
                return (T)Activator.CreateInstance(type)!;
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Failed to instantiate plugin type '{type.FullName}' from '{fullPath}': {ex.Message}", ex);
            }
        }
    }
}
