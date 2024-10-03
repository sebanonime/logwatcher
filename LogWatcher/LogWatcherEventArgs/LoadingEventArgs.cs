using System;
using System.Collections.Generic;
using System.Text;

namespace LogWatcher.LogWatcherEventArgs
{
    public class LoadingEventArgs : EventArgs
    {
        private long _maxValue;
        public long MaxValue
        {
            get { return _maxValue; }
        }

        private long _currentValue;
        public long CurrentValue 
        {
            get { return _currentValue; } 
        }

        public LoadingEventArgs(long currentValue, long maxValue)
        {
            _currentValue = currentValue;
            _maxValue = maxValue;
        }
    }
}
