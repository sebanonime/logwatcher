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
        private bool _isSoakRunning = false;
        private CancellationTokenSource? _soakCts;

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

        // --- Action 4: Soak Test (bounded-duration unattended run) ---
        private async void BtnSoak_Click(object sender, RoutedEventArgs e)
        {
            if (_isSoakRunning)
            {
                _soakCts?.Cancel();
                return;
            }

            if (!double.TryParse(TxtSoakDurationHours.Text, out double durationHours) || durationHours <= 0
                || !int.TryParse(TxtLoopInterval.Text, out int intervalMs) || intervalMs <= 0
                || !int.TryParse(TxtSoakBurstEveryMin.Text, out int burstEveryMin) || burstEveryMin < 0
                || !int.TryParse(TxtBurstLines.Text, out int burstLines) || burstLines <= 0
                || !int.TryParse(TxtSoakRollEveryMin.Text, out int rollEveryMin) || rollEveryMin < 0
                || !int.TryParse(TxtSoakIdleEveryMin.Text, out int idleEveryMin) || idleEveryMin < 0
                || !int.TryParse(TxtSoakIdleDurationMin.Text, out int idleDurationMin) || idleDurationMin < 0)
            {
                MessageBox.Show("Please enter valid soak test parameters.", "Invalid Input", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            ConfigureLogDirectoryAndCounter();
            _soakCts = new CancellationTokenSource();
            _isSoakRunning = true;
            BtnSoak.Content = "Stop Soak Test";
            UpdateUIState();

            string scheduleLogPath = Path.Combine(Path.GetDirectoryName(_activeFilePath) ?? ".", "soak-schedule.log");
            void LogSchedule(string evt)
            {
                try { File.AppendAllText(scheduleLogPath, $"{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff} | {evt}{Environment.NewLine}"); }
                catch { /* best effort — must never crash the soak run */ }
            }

            var token = _soakCts.Token;
            var endAt = DateTime.Now.AddHours(durationHours);
            LogSchedule($"SOAK START duration={durationHours}h interval={intervalMs}ms burstEvery={burstEveryMin}min burstLines={burstLines} rollEvery={rollEveryMin}min idleEvery={idleEveryMin}min idleDuration={idleDurationMin}min startLine=#{_currentLineNumber}");
            UpdateStatus($"Soak test running until {endAt:yyyy-MM-dd HH:mm:ss}...");

            var lastBurst = DateTime.Now;
            var lastRoll = DateTime.Now;
            var lastIdle = DateTime.Now;

            try
            {
                using var timer = new PeriodicTimer(TimeSpan.FromMilliseconds(intervalMs));
                while (!token.IsCancellationRequested && DateTime.Now < endAt)
                {
                    var now = DateTime.Now;

                    if (idleEveryMin > 0 && (now - lastIdle).TotalMinutes >= idleEveryMin)
                    {
                        lastIdle = DateTime.Now;
                        LogSchedule($"IDLE START duration={idleDurationMin}min line=#{_currentLineNumber}");
                        UpdateStatus($"Soak test: idle pause ({idleDurationMin} min)...");
                        try { await Task.Delay(TimeSpan.FromMinutes(idleDurationMin), token); }
                        catch (OperationCanceledException) { break; }
                        LogSchedule($"IDLE END line=#{_currentLineNumber}");
                        lastBurst = DateTime.Now;
                        lastRoll = DateTime.Now;
                        UpdateStatus($"Soak test running until {endAt:yyyy-MM-dd HH:mm:ss}...");
                        continue;
                    }

                    if (rollEveryMin > 0 && (now - lastRoll).TotalMinutes >= rollEveryMin)
                    {
                        lastRoll = now;
                        SimulateRoll();
                        LogSchedule($"ROLL simulated line=#{_currentLineNumber}");
                    }

                    if (burstEveryMin > 0 && (now - lastBurst).TotalMinutes >= burstEveryMin)
                    {
                        lastBurst = now;
                        LogSchedule($"BURST start count={burstLines} line=#{_currentLineNumber}");
                        await Task.Run(() =>
                        {
                            Parallel.For(0, burstLines, _ => LogLine("SOAK-BURST"));
                            LogManager.Flush();
                        });
                        LogSchedule($"BURST end line=#{_currentLineNumber}");
                    }

                    LogLine("SOAK");

                    if (!await timer.WaitForNextTickAsync(token)) break;
                }
            }
            catch (OperationCanceledException) { }
            finally
            {
                LogSchedule($"SOAK END line=#{_currentLineNumber}");
                _isSoakRunning = false;
                BtnSoak.Content = "Start Soak Test";
                UpdateUIState();
                UpdateStatus($"Soak test finished at line #{_currentLineNumber}.");
            }
        }

        /// <summary>
        /// Simulates a real-world log rotation: archives the current file under a timestamped name
        /// and lets NLog create a fresh file at the original path, while _currentLineNumber keeps
        /// incrementing (mirroring apps that continue numbering across a rotation).
        /// Switches NLog's logPath variable away and back so the file handle is released before the
        /// rename, avoiding file-lock issues.
        /// </summary>
        private void SimulateRoll()
        {
            lock (_logLock)
            {
                try
                {
                    string original = _activeFilePath;
                    string tempPath = original + ".switching";

                    LogManager.Configuration.Variables["logPath"] = tempPath;
                    LogManager.ReconfigExistingLoggers();
                    LogManager.Flush();

                    if (File.Exists(original))
                    {
                        string archivePath = Path.Combine(
                            Path.GetDirectoryName(original) ?? ".",
                            $"{Path.GetFileNameWithoutExtension(original)}.{DateTime.Now:yyyyMMdd-HHmmss}{Path.GetExtension(original)}");
                        File.Move(original, archivePath, overwrite: true);
                    }
                    if (File.Exists(tempPath)) File.Delete(tempPath);

                    LogManager.Configuration.Variables["logPath"] = original;
                    LogManager.ReconfigExistingLoggers();
                }
                catch { /* best effort — a failed simulated roll shouldn't crash the soak test */ }
            }
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
                bool anyRunning = _isLoopRunning || _isBurstRunning || _isFillRunning || _isSoakRunning;
                TxtFilePath.IsEnabled = !anyRunning;

                // Loop inputs enabled when loop is stopped
                TxtLoopInterval.IsEnabled = !_isLoopRunning && !_isSoakRunning;
                BtnLoop.IsEnabled = !_isSoakRunning;

                // Burst and Fill buttons remain available during loop, but disabled while running their own tasks
                TxtBurstLines.IsEnabled = !_isBurstRunning && !_isSoakRunning;
                BtnBurst.IsEnabled = !_isBurstRunning && !_isSoakRunning;

                TxtTargetMB.IsEnabled = !_isFillRunning;
                BtnFillFile.IsEnabled = !_isFillRunning && !_isSoakRunning;

                // Soak test parameter inputs locked while the soak test itself is running
                bool soakInputsEnabled = !_isSoakRunning;
                TxtSoakDurationHours.IsEnabled = soakInputsEnabled;
                TxtSoakBurstEveryMin.IsEnabled = soakInputsEnabled;
                TxtSoakRollEveryMin.IsEnabled = soakInputsEnabled;
                TxtSoakIdleEveryMin.IsEnabled = soakInputsEnabled;
                TxtSoakIdleDurationMin.IsEnabled = soakInputsEnabled;
            });
        }

        private void UpdateStatus(string message)
        {
            Dispatcher.Invoke(() => TxtStatus.Text = message);
        }
    }
}