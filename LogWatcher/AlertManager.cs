using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Timers;
using LogWatcher.Common;
using System.IO;
using LogWatcher.LogWatcherEventArgs;
using Timer=System.Timers.Timer;

namespace LogWatcher
{
    public class AlertManager
    {
        #region Fields

        private readonly Dictionary<AlertFile, ILogWatcherCustom> _allAlertFile = new Dictionary<AlertFile, ILogWatcherCustom>();
        private static readonly AlertManager _singleton = new AlertManager();
        private readonly Queue<AlertMessage> _alerts = new Queue<AlertMessage>();
        private readonly Timer _alertTimer = new Timer();

        //private static string _searchedFile;

        #endregion

        #region Properties

        public static AlertManager Singleton
        {
            [DebuggerStepThrough]
            get { return _singleton; }
        }

        #endregion

        #region Event

        public event EventHandler<AlertEventArgs> OnAlert;
        public event EventHandler<LogwatcherErrorEventArgs> OnError;

        #endregion

        #region Constructors

        /// <summary>
        /// Initialise une nouvelle instance de la classe <see cref="T:System.Object" />.
        /// </summary>
        private AlertManager()
        {
            _alertTimer.Elapsed += OnAlertTimer_Elapsed;
            _alertTimer.Interval = 5000;
            _alertTimer.AutoReset = true;
        }

        #endregion

        #region Event Handler

        private void OnNewRows(object sender, NewRowEventArgs e)
        {
            ILogWatcherCustom fwc = sender as FileWatcherCustom;
            if (fwc != null)
                TestForAlert(fwc.Name, e.NewLine);
        }

        private void OnFileIsLoaded(object sender, EventArgs e)
        {
            ILogWatcherCustom fwc = sender as FileWatcherCustom;
            if (fwc != null)
            {
                fwc.NewRows += OnNewRows;
            }
        }

        private void OnAlertTimer_Elapsed(object sender, ElapsedEventArgs e)
        {
            if (_alerts.Count > 0)
            {
                List<AlertMessage> allAlert = new List<AlertMessage>();
                int count = _alerts.Count;
                for (int i = 0; i < count; i++)
                {
                    allAlert.Add(_alerts.Dequeue());
                }

                if (OnAlert != null)
                    OnAlert(this, new AlertEventArgs(allAlert));
            }

            CheckAlertFiles();
        }

        private void OnReloadLog(object sender, EventArgs e)
        {
            ILogWatcherCustom fwc = sender as FileWatcherCustom;
            if (fwc != null)
            {
                fwc.NewRows -= OnNewRows;
            }
        }

        #endregion

        #region Methods

        public void Init()
        {
            RefreshAlert();
        }

        public void RefreshAlert()
        {
            ThreadPool.QueueUserWorkItem(delegate
             {
                 _alertTimer.Stop();
                 foreach (AlertFile alertFile in LogConfig.Singleton.DicoAlertFile)
                 {
                     try
                     {
                         Encoding encoding = LogConfig.Singleton.DefaultEncoding != null
                                                 ? LogConfig.Singleton.MapEncoding(LogConfig.Singleton.DefaultEncoding)
                                                 : Encoding.Default;

                         ILogWatcherCustom fwc;

                         if (!_allAlertFile.TryGetValue(alertFile, out fwc)) // this is not monitored
                         {
                             if (alertFile.IsActif)
                             {
                                 fwc = new FileWatcherCustom();
                                 fwc.Init(FileNameManager.GetRealFileName(alertFile.FilePath), encoding);
                                 fwc.InitialLoadFinished += OnFileIsLoaded;
                                 fwc.ReloadLog += OnReloadLog;
                                 _allAlertFile.Add(alertFile, fwc);
                             }
                             else
                             {
                                 continue;
                             }
                         }
                         //else //this is already monitored
                         //{
                         //    fwc.FullName
                         //}

                         if (alertFile.IsActif)
                         {
                             fwc.Start();
                         }
                         else
                         {
                             fwc.Stop();
                             fwc.NewRows -= OnNewRows;
                             fwc.InitialLoadFinished -= OnFileIsLoaded;
                             _allAlertFile.Remove(alertFile);
                         }
                     }
                     catch (FileNotFoundException)
                     {
                         alertFile.IsActif = false;
                         if (OnError != null)
                             OnError(this, new LogwatcherErrorEventArgs(string.Format("File not found. Alert for this file is now desactivated : {0}", alertFile.FilePath)));
                     }
                     catch (Exception ex)
                     {
                         alertFile.IsActif = false;
                         if (OnError != null)
                             OnError(this, new LogwatcherErrorEventArgs(string.Format("Error for file alert, this alert is now desactivated : {0}", alertFile.FilePath), ex));
                     }
                 }
                 _alertTimer.Start();
             });
        }

        private void CheckAlertFiles()
        {
            // if one file name have change (for ex :  because of new date), we refresh all alert
            foreach (AlertFile alertFile in LogConfig.Singleton.DicoAlertFile)
            {
                string fileName = FileNameManager.GetRealFileName(alertFile.FilePath);
                if (fileName != alertFile.FilePath) // this is a dynamic file name so maybe the file name have change
                {
                    ILogWatcherCustom fwc;
                    if (alertFile.IsActif && _allAlertFile.TryGetValue(alertFile, out fwc))
                    {
                        if (fileName != fwc.FullName) // we check if new file name is different then the actual one
                        {
                            RefreshAlert();
                            break;
                        }
                    }
                }
                
            }
        }

        private void TestForAlert(string fileName, string mess)
        {
            foreach (AlertInfo infoTmp in LogConfig.Singleton.DicoAlert)
            {
                if (infoTmp.IsActif && Regex.IsMatch(mess, infoTmp.SearchText, RegexOptions.IgnoreCase))
                {
                    _alerts.Enqueue(new AlertMessage(mess, infoTmp.Message, fileName));
                }
            }
        }

        #endregion
    }
}
