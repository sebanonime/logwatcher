using NLog;
using NLog.Config;
using NLog.Targets;
using System.Diagnostics;

internal static class Program
{
	private static readonly Logger Logger = LogManager.GetCurrentClassLogger();

	private static void Main()
	{
		while (true)
		{
			Console.WriteLine();
			Console.WriteLine("LogGenerator");
			Console.WriteLine("1) Fill file to final size");
			Console.WriteLine("2) Write file at regular interval");
			Console.WriteLine("3) Exit");
			Console.Write("Choice: ");

			var choice = (Console.ReadLine() ?? string.Empty).Trim();

			if (choice == "1")
			{
				FillFileToTargetSize();
			}
			else if (choice == "2")
			{
				WriteAtRegularInterval();
			}
			else if (choice == "3")
			{
				LogManager.Shutdown();
				return;
			}
			else
			{
				Console.WriteLine("Invalid choice.");
			}
		}
	}

	private static void FillFileToTargetSize()
	{
		var path = Ask("File path");
		if (string.IsNullOrWhiteSpace(path))
		{
			Console.WriteLine("Path is required.");
			return;
		}

		if (!TryReadDouble("Final size in MB", out var sizeMb) || sizeMb <= 0)
		{
			Console.WriteLine("Invalid size.");
			return;
		}

		ConfigureFileLogger(path);

		var targetBytes = (long)(sizeMb * 1024 * 1024);
		var currentSize = File.Exists(path) ? new FileInfo(path).Length : 0L;

		if (currentSize >= targetBytes)
		{
			Console.WriteLine("File already has target size or more.");
			return;
		}

		var sw = Stopwatch.StartNew();
		var lineNumber = 1;

		while (currentSize < targetBytes)
		{
			var now = DateTime.Now;
			var payload = $"{lineNumber:D9} | {now:yyyy-MM-dd HH:mm:ss.fff} | INFO | sample log payload";
			Logger.Info(payload);
			lineNumber++;

			currentSize = File.Exists(path) ? new FileInfo(path).Length : currentSize;
		}

		sw.Stop();
		var finalSize = new FileInfo(path).Length;
		Console.WriteLine($"Done in {sw.Elapsed.TotalSeconds:F2}s | Final size: {finalSize / 1024d / 1024d:F2} MB");
	}

	private static void WriteAtRegularInterval()
	{
		var path = Ask("File path");
		if (string.IsNullOrWhiteSpace(path))
		{
			Console.WriteLine("Path is required.");
			return;
		}

		if (!TryReadDouble("Interval in seconds (ex: 1)", out var intervalSeconds) || intervalSeconds <= 0)
		{
			Console.WriteLine("Invalid interval.");
			return;
		}

		if (!TryReadInt("How many lines (0 = infinite)", out var linesToWrite) || linesToWrite < 0)
		{
			Console.WriteLine("Invalid number of lines.");
			return;
		}

		ConfigureFileLogger(path);

		Console.WriteLine("Writing... Press Ctrl+C to stop if infinite mode.");

		var lineNumber = 1;
		while (linesToWrite == 0 || lineNumber <= linesToWrite)
		{
			var now = DateTime.Now;
			Logger.Info($"{lineNumber:D9} | {now:yyyy-MM-dd HH:mm:ss.fff} | INFO | periodic line");
			lineNumber++;
			Thread.Sleep(TimeSpan.FromSeconds(intervalSeconds));
		}

		Console.WriteLine("Done.");
	}

	private static void ConfigureFileLogger(string filePath)
	{
		var dir = Path.GetDirectoryName(filePath);
		if (!string.IsNullOrWhiteSpace(dir))
		{
			Directory.CreateDirectory(dir);
		}

		var config = new LoggingConfiguration();

		var fileTarget = new FileTarget("logfile")
		{
			FileName = filePath,
			Layout = "${message}",
			KeepFileOpen = false,
			Encoding = System.Text.Encoding.UTF8
		};

		config.AddRule(LogLevel.Info, LogLevel.Fatal, fileTarget);
		LogManager.Configuration = config;
		LogManager.ReconfigExistingLoggers();
	}

	private static string Ask(string label)
	{
		Console.Write($"{label}: ");
		return Console.ReadLine() ?? string.Empty;
	}

	private static bool TryReadDouble(string label, out double value)
	{
		Console.Write($"{label}: ");
		return double.TryParse(Console.ReadLine(), out value);
	}

	private static bool TryReadInt(string label, out int value)
	{
		Console.Write($"{label}: ");
		return int.TryParse(Console.ReadLine(), out value);
	}
}
