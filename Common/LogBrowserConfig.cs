using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LogWatcher.Common
{
    public class LogBrowserConfig
    {
        public LogBrowserConfig()
        {
            VirtualDirectories = new Dictionary<string, List<LogBrowserVirtualFile>>();
            RealDirectories = new List<LogBrowserItem>();
        }

        public Dictionary<string, List<LogBrowserVirtualFile>> VirtualDirectories { get; set; }
        public List<LogBrowserItem> RealDirectories { get; set; }
    }
}
