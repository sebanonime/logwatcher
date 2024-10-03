using System;
using System.Collections.Generic;
using System.Text;

namespace LogWatcher.Common
{
    public class PluginEventArgs : EventArgs
    {
        public string Message { get; set; }

        public PluginEventArgs(string message)
        {
            Message = message;
        }
    }
}
