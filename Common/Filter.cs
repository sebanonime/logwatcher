using System;
using System.Collections.Generic;
using System.Text;

namespace LogWatcher.Common
{
    public class Filter
    {
        public bool IsRegexp { get; set; }
        public bool IgnoreCase { get; set; }
        //public bool IsRegexp { get; set; }

        public string Critere { get; set; }
    }
}
