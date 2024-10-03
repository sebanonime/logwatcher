using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.VisualBasic.ApplicationServices;
using LogWatcher.Frm;

namespace LogWatcher
{
    class InstanceSingleton : WindowsFormsApplicationBase
    {
        public delegate void ProcessParametersDelegate(object sender, string[] args);

        public InstanceSingleton()
        {
            IsSingleInstance = LogConfig.Singleton.IsSingleInstance;
            StartupNextInstance += new StartupNextInstanceEventHandler(SIApp_StartupNextInstance);
        }

        protected override void OnCreateMainForm()
        {
            MainForm = Frm_Master.Singleton;

            string[] args = new string[CommandLineArgs.Count];
            CommandLineArgs.CopyTo(args, 0);

            Frm_Master.Singleton.LogsLoadByParam = new List<string>(args);
        }

        protected void SIApp_StartupNextInstance(object sender, StartupNextInstanceEventArgs eventArgs)
        {
            // Copy the arguments to a string array

            string[] args = new string[eventArgs.CommandLine.Count];
            eventArgs.CommandLine.CopyTo(args, 0);

            // Create an argument array for the Invoke method
            object[] parameters = new object[2];
            parameters[0] = this.MainForm;
            parameters[1] = args;

            Frm_Master.Singleton.BeginInvoke(new ProcessParametersDelegate(Frm_Master.Singleton.ProcessParameters), parameters);
        }
    }
}
