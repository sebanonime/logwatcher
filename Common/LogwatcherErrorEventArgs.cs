using System;
using System.Collections.Generic;
using System.Text;

namespace LogWatcher.Common
{
    public class LogwatcherErrorEventArgs : EventArgs
    {
        public Exception InnerException { get; private set; }
        public string Message {get; private set;}

        /// <summary>
        ///                     Initializes a new instance of the <see cref="T:System.EventArgs" /> class.
        /// </summary>
        public LogwatcherErrorEventArgs(string message, Exception innerException)
        {
            InnerException = innerException;
            Message = message;
        }

        /// <summary>
        ///                     Initializes a new instance of the <see cref="T:System.EventArgs" /> class.
        /// </summary>
        public LogwatcherErrorEventArgs(string message)
        {
            Message = message;
        }
    }
}
