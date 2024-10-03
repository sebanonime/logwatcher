using System;
using System.Collections.Generic;
using System.Text;
using LogWatcher.Common.ThreadDispatcher;
using System.Text.RegularExpressions;
using LogWatcher.Common;

namespace LogWatcher
{
    public class NewLineTask : ITaskDispatcher
    {
        #region Fields
        string _line;
        Regex _startupFilter;
        ListLog _logCache;
        private bool _visible;
        Profile _currentProfile; 
        #endregion

        #region Properties
        public object ContextObject { get; set; } 
        #endregion

        public NewLineTask(Profile currentProfile, string line, Regex startupFilter, ListLog logCache, bool isLast)
        {
            _line = line;
            _logCache = logCache;
            _startupFilter = startupFilter;
            _currentProfile = currentProfile;
            ContextObject = isLast;
        }

        public void Execute()
        {
            if (_startupFilter != null && _startupFilter.IsMatch(_line))
            {
                _visible = true;
            }
            else
            {
                _visible = TestLineVisibility(_line);
            }
        }

        public void AfterExecute()
        {
            if (_visible)
            {
                _logCache.Add(_line);
                //PluginManager.Singleton.RaiseNewLineEvent(_line);
            }
        }

        private bool TestLineVisibility(string message)
        {
            foreach (HiddenLine lineTmp in _currentProfile.DicoHiddenLog)
            {
                if (lineTmp.IsActif)
                {
                    if ((!lineTmp.IsRegex && message.Contains(lineTmp.Text)) ||
                        (lineTmp.IsRegex && Regex.IsMatch(message, lineTmp.Text, lineTmp.CaseSensitive ? RegexOptions.None : RegexOptions.IgnoreCase)))
                    {
                        return false;
                    }
                }
            }

            return true;
        }
    }
}
