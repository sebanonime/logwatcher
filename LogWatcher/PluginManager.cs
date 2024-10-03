using System;
using System.Collections.Generic;
using System.Text;
using LogWatcher.Common;
using System.Runtime.Remoting;
using WeifenLuo.WinFormsUI.Docking;
using System.Threading;

namespace LogWatcher
{
    internal class PluginManager
    {
        private static PluginManager _singleton = new PluginManager();
        Dictionary<string, BasePlugin> _allPlugin = new Dictionary<string, BasePlugin>();

        public static PluginManager Singleton
        {
            get { return _singleton; }
        }

        private PluginManager()
        {
        }

        internal void LoadPlugin(Plugin plugin2Load, Dictionary<Guid, LogManager> DicoLog, ILogManager CurrentLog, DockPanel Pnl_Dock)
        {
            BasePlugin plugin = null;
            try
            {
                Type tmp = Type.GetType(plugin2Load.TypeName, false, true);
                plugin = Activator.CreateInstance(tmp) as BasePlugin;
            }
            catch (Exception ex)
            {
                throw new Exception(String.Format("Loading Plugin error ({0}) : {1}", plugin2Load.Text, ex.Message));
            }


            Dictionary<Guid, ILogManager> newDico = new Dictionary<Guid, ILogManager>();
            foreach (KeyValuePair<Guid, LogManager> item in DicoLog)
            {
                newDico.Add(item.Key, item.Value);
            }

            plugin.DicoLog = newDico;
            plugin.CurrentLog = CurrentLog;
            plugin.Pnl_Dock = Pnl_Dock;

            //ThreadPool.QueueUserWorkItem(delegate
            //{
                try
                {
                    plugin.Run();
                }
                catch(Exception ex)
                {
                    throw new Exception(String.Format("Running plugin error ({0} : {1})", plugin2Load.Text, ex.Message));
                }
            //});

                if (!_allPlugin.ContainsKey(plugin2Load.Text))
                {
                    _allPlugin.Add(plugin2Load.Text, plugin);
                }
                else
                {
                    _allPlugin.Remove(plugin2Load.Text);
                    _allPlugin.Add(plugin2Load.Text, plugin);
                }
        }

        internal void UpdateCurrentLog(ILogManager currentLog)
        {
            ThreadPool.QueueUserWorkItem(delegate
            {
                foreach (BasePlugin plugin in _allPlugin.Values)
                {
                    plugin.CurrentLog = currentLog;
                }
            });
        }

        internal void UpdateDicoLog(Dictionary<Guid, LogManager> DicoLog)
        {
            ThreadPool.QueueUserWorkItem(delegate
            {
                foreach (BasePlugin plugin in _allPlugin.Values)
                {
                    Dictionary<Guid, ILogManager> newDico = new Dictionary<Guid, ILogManager>();
                    foreach (KeyValuePair<Guid, LogManager> item in DicoLog)
                    {
                        newDico.Add(item.Key, item.Value);
                    }

                    plugin.DicoLog = newDico;
                }
            });
        }

        public void RaiseNewLineEvent(string line)
        {
            ThreadPool.QueueUserWorkItem(delegate
                                             {
                                                 foreach (BasePlugin plug in _allPlugin.Values)
                                                 {
                                                     plug.RaiseNewLineEvent(line);
                                                 }
                                             });
            
        }
    }
}
