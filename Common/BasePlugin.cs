using System;
using System.Collections.Generic;
using System.Text;
using LogWatcher.Common;
using WeifenLuo.WinFormsUI.Docking;

namespace LogWatcher.Common
{
    public abstract class BasePlugin
    {
        //private Dictionary<Guid, ILogManager> _dicolog;
        //private ILogManager _currentLog;
        public BasePlugin()
        {
        }

        //public EventHandler<EventArgs> OnLogChange;

        //public void RaiseEvent()
        //{
        //    OnLogChange(null, new EventArgs());

        //}

        public Dictionary<Guid, ILogManager> DicoLog { get; set; }
        public ILogManager CurrentLog { get; set; }
        public DockPanel Pnl_Dock { get; set; }
        public virtual event EventHandler<PluginEventArgs> NewLine;
        public abstract void Run();

        public void RaiseNewLineEvent(string line)
        {
            if (NewLine != null)
                NewLine(null, new PluginEventArgs(line));
        }

    }
}
