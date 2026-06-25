using NLog;
using NLog.Config;
using NLog.Targets;
using NLog.Targets.Wrappers;
using System;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

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

		Console.WriteLine($"\nFilling {filePath} to {sizeMb} MB using parallelism...");
		var sw = Stopwatch.StartNew();

		long bytesWritten = 0;
		int numThreads = Environment.ProcessorCount;
		int batchSize = 1000; // Nombre de lignes par écriture pour optimiser les perfs

		Parallel.For(0, numThreads, (threadId, state) =>
		{
			StringBuilder sb = new StringBuilder();
			int localLineNumber = threadId;

			while (Interlocked.Read(ref bytesWritten) < targetBytes && !state.IsStopped)
			{
				sb.Clear();
				long localBytes = 0;

				for (int i = 0; i < batchSize; i++)
				{
					string logEntry = $"This is a sample log line. Index: {localLineNumber:D10} | Timestamp: {DateTime.Now:yyyy-MM-dd HH:mm:ss.fff} | Level: INFO | Message: Sample application log entry";
					sb.AppendLine(logEntry);
					
					// Estimation en octets (UTF-8 basique)
					localBytes += logEntry.Length + Environment.NewLine.Length; 
					localLineNumber += numThreads;
				}

				// TrimEnd évite que NLog ajoute un double saut de ligne à la fin du batch
				Logger.Info(sb.ToString().TrimEnd('\r', '\n'));

				Interlocked.Add(ref bytesWritten, localBytes);
			}
		});

		// Force l'écriture sur le disque de la file d'attente asynchrone avant de stopper le chronomètre
		LogManager.Flush();
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
			
			// Optimisations de performances
			KeepFileOpen = true,
			// La propriété ConcurrentWrites a été supprimée dans NLog 6.0.
			// L'AsyncTargetWrapper ci-dessous suffit à éviter les blocages I/O.

			// Configuration du Rolling (archivage au démarrage)
			ArchiveOldFileOnStartup = true,
			
			// Nouvelle syntaxe d'archivage NLog 6.0+
			ArchiveFileName = filePath + ".archive", 
			ArchiveSuffixFormat = "_{0:0000}", // Remplace ArchiveNumberingMode.Sequence
			MaxArchiveFiles = 10
		};

		// Async wrapper pour retirer les verrous I/O bloquants
		var asyncTarget = new AsyncTargetWrapper(fileTarget)
		{
			QueueLimit = 20000,
			OverflowAction = AsyncTargetWrapperOverflowAction.Block
		};

		config.AddTarget("file", asyncTarget);
		config.AddRule(LogLevel.Debug, LogLevel.Fatal, asyncTarget);

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