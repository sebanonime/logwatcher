using LogWatcher;
using LogWatcher.Common;
using LogWatcher.LogWatcherEventArgs;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading;

namespace AvalonDock.VS2013Test.ViewModels
{
    public class LogPanelViewModel : FileViewModel
    {
        private LogManager myLog;
        private string loadingText;
        private string listVisibility;
        private bool listIsEnabled;
        private List<LogRow> logRows = new List<LogRow>();
        private Timer tailTimer;

        public LogPanelViewModel(LogManager myLog) : base(myLog.FilePath)
        {
            this.ListIsEnabled = false;
            //this.ListVisibility = "Collapsed";
            this.ListVisibility = "Visible";
            this.AllLogRow = new BindingList<LogRow>();
            this.myLog = myLog;
            this.myLog.NewLine += this.OnNewLine;
            this.myLog.OnLoading += this.OnLoading;
            this.myLog.LoadFinished += this.OnLoadFinished;

            ////this.tailTimer = new Timer(OnTailTimerEllapsed, null, 1000, 1000);


            //for (int i = 0; i < 100; i++)
            //{
            //    this.AllLogRow.Add(new LogRow("Log" + i));
            //}
        }

        public event Action<LogRow> ScrollBottom;

        public event Action<Action> ExecuteInGuiThread;

        public BindingList<LogRow> AllLogRow { get; set; }

        private void OnTailTimerEllapsed(object state)
        {
            var last = this.AllLogRow.LastOrDefault();
            if (last != null)
            {
                this.ScrollBottom?.Invoke(last);
            }
        }

        public string LoadingText 
        {
            get => loadingText;
            set 
            { 
                loadingText = value;
                this.RaisePropertyChanged(nameof(LoadingText));
            }
        }

        public string ListVisibility
        {
            get => listVisibility;
            set
            {
                listVisibility = value;
                this.RaisePropertyChanged(nameof(ListVisibility));
            }
        }

        public bool ListIsEnabled
        {
            get => listIsEnabled;
            set
            {
                listIsEnabled = value;
                this.RaisePropertyChanged(nameof(ListIsEnabled));
            }
        }
        private void OnLoadFinished()
        {
            this.ListIsEnabled = true;
            
            this.LoadingText = $"Loaded";
            this.AllLogRow = new BindingList<LogRow>(logRows);
            this.RaisePropertyChanged(nameof(AllLogRow));
            //logRows.Clear();
        }

        private void OnLoading(object sender, LoadingEventArgs e)
        {
            this.LoadingText = $"Loading {e.CurrentValue}/{e.MaxValue}";
        }

        private void OnNewLine(LogRow lineInfo)
        {
            if (!this.ListIsEnabled)
            {
                logRows.Add(lineInfo);
            }
            else
            {
                this.ExecuteInGuiThread?.Invoke(new Action(() =>
                {
                    this.AllLogRow.Add(lineInfo);
                }));
            }
        }
    }
}
