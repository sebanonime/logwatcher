using NLog;
using NLog.Config;
using NLog.Targets;
using System.Diagnostics;
using System.Text;

class Program
{
	private static readonly Logger Logger = LogManager.GetCurrentClassLogger();

	static void Main(string[] args)
	{
		ConfigureNLog();

		Console.WriteLine("=== LogWatcher Log File Generator ===\n");

		while (true)
		{
			Console.WriteLine("Select an operation:");
			Console.WriteLine("1. Fill a file to a specific size (MB)");
			Console.WriteLine("2. Write to a file at regular intervals");
			Console.WriteLine("3. Exit");
			Console.Write("\nEnter choice (1-3): ");

			string choice = Console.ReadLine()?.Trim() ?? "";

			switch (choice)
			{
				case "1":
					FillFileToSize();
					break;
				case "2":
					WriteAtIntervals();
					break;
				case "3":
					LogManager.Shutdown();
					return;
				default:
					Console.WriteLine("Invalid choice. Try again.\n");
					break;
			}

			Console.WriteLine();
		}
	}

	static void FillFileToSize()
	{
		Console.Write("Enter target file path: ");
		string filePath = Console.ReadLine()?.Trim() ?? "";
		if (string.IsNullOrEmpty(filePath))
		{
			Console.WriteLine("Invalid file path.");
			return;
		}

		Console.Write("Enter target file size (MB): ");
		if (!double.TryParse(Console.ReadLine(), out double sizeMb) || sizeMb <= 0)
		{
			Console.WriteLine("Invalid size.");
			return;
		}

		long targetBytes = (long)(sizeMb * 1024 * 1024);

		SetupNLogTarget(filePath);

		Console.WriteLine($"\nFilling {filePath} to {sizeMb} MB...");
		var sw = Stopwatch.StartNew();

		long bytesWritten = 0;
		int lineNumber = 1;
		string sampleLogLine = "This is a sample log line. Index: {0:D10} | Timestamp: {1:yyyy-MM-dd HH:mm:ss.fff} | Level: INFO | Message: Sample application log entry\n";

		while (bytesWritten < targetBytes)
		{
			string logEntry = string.Format(sampleLogLine, lineNumber, DateTime.Now);
			byte[] bytes = Encoding.UTF8.GetBytes(logEntry);
			bytesWritten += bytes.Length;
            
			Logger.Info($"Line {lineNumber}: Written {bytesWritten / (1024 * 1024.0):F2} MB");
			lineNumber++;

			if (bytesWritten % (100 * 1024 * 1024) == 0)
			{
				System.GC.Collect();
			}
		}

		sw.Stop();
		Console.WriteLine($"\n✓ Completed in {sw.ElapsedMilliseconds} ms");
		Console.WriteLine($"✓ File: {filePath}");
		Console.WriteLine($"✓ Actual size: {new FileInfo(filePath).Length / (1024.0 * 1024.0):F2} MB");
		Console.WriteLine();
	}

	static void WriteAtIntervals()
	{
		Console.Write("Enter log file path: ");
		string filePath = Console.ReadLine()?.Trim() ?? "";
		if (string.IsNullOrEmpty(filePath))
		{
			Console.WriteLine("Invalid file path.");
			return;
		}

		Console.Write("Enter interval in seconds (e.g., 1 for 1 line per second): ");
		if (!double.TryParse(Console.ReadLine(), out double intervalSeconds) || intervalSeconds <= 0)
		{
			Console.WriteLine("Invalid interval.");
			return;
		}

		Console.Write("Enter duration in seconds (0 = infinite, until Ctrl+C): ");
		if (!double.TryParse(Console.ReadLine(), out double durationSeconds))
		{
			Console.WriteLine("Invalid duration.");
			return;
		}

		SetupNLogTarget(filePath);

		Console.WriteLine($"\nWriting to {filePath} every {intervalSeconds} second(s)...");
		Console.WriteLine("Press Ctrl+C to stop.\n");

		var sw = Stopwatch.StartNew();
		int lineNumber = 1;

		try
		{
			while (true)
			{
				if (durationSeconds > 0 && sw.Elapsed.TotalSeconds >= durationSeconds)
					break;

				DateTime now = DateTime.Now;
				Logger.Info($"[{lineNumber:D6}] Regular update - {now:yyyy-MM-dd HH:mm:ss.fff} | Application running normally | Events processed: {lineNumber * 10} | Memory: {GC.GetTotalMemory(false) / (1024.0 * 1024.0):F2} MB");
				lineNumber++;

				Thread.Sleep((int)(intervalSeconds * 1000));
			}
		}
		catch (OperationCanceledException)
		{
		}

		sw.Stop();
		Console.WriteLine($"\n✓ Stopped after {sw.Elapsed.TotalSeconds:F1} seconds");
		Console.WriteLine($"✓ Total lines written: {lineNumber}");
		Console.WriteLine($"✓ File: {filePath}");
		Console.WriteLine($"✓ File size: {new FileInfo(filePath).Length / 1024.0:F2} KB");
		Console.WriteLine();
	}

	static void SetupNLogTarget(string filePath)
	{
		var config = new LoggingConfiguration();

		var fileTarget = new FileTarget
		{
			FileName = filePath,
			Layout = "${message}",
			Encoding = Encoding.UTF8,
			EnableFileDelete = false,
			ArchiveAboveSize = -1,
		};

		config.AddTarget("file", fileTarget);
		config.AddRule(LogLevel.Debug, LogLevel.Fatal, fileTarget);

		LogManager.Configuration = config;
	}

	static void ConfigureNLog()
	{
		var config = new LoggingConfiguration();

		var consoleTarget = new ConsoleTarget
		{
			Layout = "${longdate} [${level:uppercase}] ${message}"
		};

		config.AddTarget("console", consoleTarget);
		config.AddRule(LogLevel.Info, LogLevel.Fatal, consoleTarget);

		LogManager.Configuration = config;
	}
}
