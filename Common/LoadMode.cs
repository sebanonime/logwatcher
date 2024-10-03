using System;
using System.Collections.Generic;
using System.Text;

namespace LogWatcher.Common
{
    public class LoadMode
    {
        public enum AllLoadMode
        {
            Full,
            EndOfFile,
            SimpleFilter
        }

        public AllLoadMode Mode { get; private set; }
        public string DisplayText { get; private set; }
        public string Detail { get; private set; }


        public LoadMode(AllLoadMode mode, string displayText, string detail)
        {
            Mode = mode;
            DisplayText = displayText;
            Detail = detail;
        }
    }
}
