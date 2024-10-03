using System;
using System.Collections.Generic;
using System.Text;

namespace LogWatcher.Common
{
    public class AlertMessage
    {
        public string Message { get; private set; }
        public string FileName { get; private set; }
        public string AlertLine { get; private set; }
        public DateTime Date { get; private set; }

        /// <summary>
        /// Initialise une nouvelle instance de la classe <see cref="T:System.Object" />.
        /// </summary>
        public AlertMessage(string alertLine, string message, string fileName)
        {
            Message = message;
            FileName = fileName;
            AlertLine = alertLine;
            Date = DateTime.Now;
        }

        public override string ToString()
        {
            return string.Format("{0} ({1}) : {2}", FileName, Date.ToString("HH:mm:ss"), Message);
        }
    }
}
