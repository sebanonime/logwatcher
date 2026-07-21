using System.IO;
using System.Windows;
using System.Windows.Controls;
using NLog;

namespace AutoLogGen
{
    public partial class MainWindow : Window
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();
        
        // Critical lock object to guarantee atomic line numbering + logging order
        private readonly object _logLock = new();
        
        private long _currentLineNumber = 0;
        private CancellationTokenSource? _loopCts;
        private string _activeFilePath = string.Empty;

        private bool _isLoopRunning = false;
        private bool _isBurstRunning = false;
        private bool _isFillRunning = false;

        public MainWindow()
        {
            InitializeComponent();
            ConfigureLogDirectoryAndCounter();
        }

        private void ConfigureLogDirectoryAndCounter()
        {
            string pathInput = TxtFilePath?.Text.Trim() ?? "autoLogGen/logGen.txt";
            string fullPath = Path.GetFullPath(pathInput);

            if (_activeFilePath == fullPath) return;

            _activeFilePath = fullPath;

            // Ensure directory exists
            string? dir = Path.GetDirectoryName(fullPath);
            if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }

            // Dynamically set NLog variable
            LogManager.Configuration.Variables["logPath"] = fullPath;
            LogManager.ReconfigExistingLoggers();

            // Detect last line number in existing file
            lock (_logLock)
            {
                _currentLineNumber = GetLastLineNumber(fullPath);
            }
            
            UpdateStatus($"Target initialized: {pathInput} | Resuming from line #{_currentLineNumber}");
        }

        private long GetLastLineNumber(string filePath)
        {
            if (!File.Exists(filePath)) return 0;

            try
            {
                using var fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
                if (fs.Length == 0) return 0;

                // Seek backwards to find the start of the last line
                long pos = fs.Length - 1;
                while (pos > 0)
                {
                    fs.Position = pos;
                    if (fs.ReadByte() == '\n' && pos < fs.Length - 1)
                        break;
                    pos--;
                }

                using var sr = new StreamReader(fs);
                string? lastLine = sr.ReadLine();

                if (!string.IsNullOrWhiteSpace(lastLine))
                {
                    var parts = lastLine.Split(' ', '|', '\t');
                    if (parts.Length > 0 && long.TryParse(parts[0], out long lastNum))
                    {
                        return lastNum;
                    }
                }
            }
            catch
            {
                try
                {
                    string? lastLine = File.ReadLines(filePath).LastOrDefault();
                    if (!string.IsNullOrWhiteSpace(lastLine))
                    {
                        var parts = lastLine.Split(' ', '|', '\t');
                        if (parts.Length > 0 && long.TryParse(parts[0], out long lastNum))
                            return lastNum;
                    }
                }
                catch { }
            }

            return 0;
        }

        /// <summary>
        /// Logs a line with strict sequence ordering guaranteed across all threads.
        /// </summary>
        private void LogLine(string category)
        {
            lock (_logLock)
            {
                _currentLineNumber++;
                Logger.Info($"{_currentLineNumber} | {DateTime.Now:yyyy-MM-dd HH:mm:ss.fff} | [{category}] Log entry #{_currentLineNumber}");
            }
        }

        // --- Action 1: Timed Loop ---
        private async void BtnLoop_Click(object sender, RoutedEventArgs e)
        {
            if (_isLoopRunning)
            {
                _loopCts?.Cancel();
                _loopCts = null;
                _isLoopRunning = false;
                BtnLoop.Content = "Start Loop";
                UpdateUIState();
                UpdateStatus("Loop stopped.");
                return;
            }

            if (!int.TryParse(TxtLoopInterval.Text, out int intervalMs) || intervalMs <= 0)
            {
                MessageBox.Show("Please enter a valid interval in milliseconds.", "Invalid Input", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            ConfigureLogDirectoryAndCounter();
            _loopCts = new CancellationTokenSource();
            _isLoopRunning = true;
            BtnLoop.Content = "Stop Loop";
            UpdateUIState();
            UpdateStatus($"Loop running every {intervalMs} ms...");

            var token = _loopCts.Token;
            try
            {
                using var timer = new PeriodicTimer(TimeSpan.FromMilliseconds(intervalMs));
                while (await timer.WaitForNextTickAsync(token))
                {
                    LogLine("LOOP");
                }
            }
            catch (OperationCanceledException) { }
            finally
            {
                _isLoopRunning = false;
                BtnLoop.Content = "Start Loop";
                UpdateUIState();
            }
        }

        // --- Action 2: Multi-threaded Burst ---
        private async void BtnBurst_Click(object sender, RoutedEventArgs e)
        {
            if (!int.TryParse(TxtBurstLines.Text, out int count) || count <= 0)
            {
                MessageBox.Show("Please enter a valid count for lines.", "Invalid Input", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            ConfigureLogDirectoryAndCounter();
            _isBurstRunning = true;
            UpdateUIState();
            UpdateStatus($"Bursting {count} lines multi-threaded...");

            await Task.Run(() =>
            {
                Parallel.For(0, count, _ => LogLine("BURST"));
                LogManager.Flush();
            });

            _isBurstRunning = false;
            UpdateUIState();

            string activeLoopStatus = _isLoopRunning ? " (Loop still active)" : "";
            UpdateStatus($"Burst complete! Current line: #{_currentLineNumber}{activeLoopStatus}");
        }

        // --- Action 3: Fill File ---
        private async void BtnFillFile_Click(object sender, RoutedEventArgs e)
        {
            if (!long.TryParse(TxtTargetMB.Text, out long targetMB) || targetMB <= 0)
            {
                MessageBox.Show("Please enter a valid target size in MB.", "Invalid Input", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            ConfigureLogDirectoryAndCounter();
            long targetBytes = targetMB * 1024 * 1024;

            _isFillRunning = true;
            UpdateUIState();
            UpdateStatus($"Filling file to ~{targetMB} MB...");

            await Task.Run(() =>
            {
                Parallel.For(0, int.MaxValue, (i, state) =>
                {
                    LogLine("FILL");

                    if (i % 2000 == 0)
                    {
                        LogManager.Flush();
                        var fi = new FileInfo(_activeFilePath);
                        if (fi.Exists && fi.Length >= targetBytes)
                        {
                            state.Stop();
                        }
                    }
                });

                LogManager.Flush();
            });

            _isFillRunning = false;
            UpdateUIState();

            var fi = new FileInfo(_activeFilePath);
            double actualMB = Math.Round((double)fi.Length / (1024 * 1024), 2);

            string activeLoopStatus = _isLoopRunning ? " (Loop still active)" : "";
            UpdateStatus($"File filled! Size: {actualMB} MB | Line: #{_currentLineNumber}{activeLoopStatus}");
        }

        private void TxtFilePath_TextChanged(object sender, TextChangedEventArgs e)
        {
            if (IsLoaded)
            {
                ConfigureLogDirectoryAndCounter();
            }
        }

        private void UpdateUIState()
        {
            Dispatcher.Invoke(() =>
            {
                // Disable file path input if any operation is actively running
                bool anyRunning = _isLoopRunning || _isBurstRunning || _isFillRunning;
                TxtFilePath.IsEnabled = !anyRunning;

                // Loop inputs enabled when loop is stopped
                TxtLoopInterval.IsEnabled = !_isLoopRunning;

                // Burst and Fill buttons remain available during loop, but disabled while running their own tasks
                TxtBurstLines.IsEnabled = !_isBurstRunning;
                BtnBurst.IsEnabled = !_isBurstRunning;

                TxtTargetMB.IsEnabled = !_isFillRunning;
                BtnFillFile.IsEnabled = !_isFillRunning;
            });
        }

        private void UpdateStatus(string message)
        {
            Dispatcher.Invoke(() => TxtStatus.Text = message);
        }
    }
}