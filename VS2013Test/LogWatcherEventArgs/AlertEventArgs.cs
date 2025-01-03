using System;
using System.Collections.Generic;
using System.Text;
using LogWatcher.Common;

namespace LogWatcher.LogWatcherEventArgs
{
    public class AlertEventArgs : EventArgs
    {
        public List<AlertMessage> AllMessages { get; set; }
        //public string Message { get; set; }
        //public string FileName { get; set; }

        public AlertEventArgs(List<AlertMessage> allMessages)
        {
            AllMessages = allMessages;
        }
    }
}
