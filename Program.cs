using System;
using System.Windows.Forms;
using LogWatcher.Frm;
using System.Diagnostics;
using System.Collections.Generic;
using LogWatcher.Common.ThreadDispatcher;
using System.Threading;

namespace LogWatcher
{
    class TaskDispatcher : ITaskDispatcher
    {
        int _idx;
        public TaskDispatcher(int idx)
        {
            _idx = idx;
        }

        //Random rdm = new Random();
        public void Execute()
        {

            int tempo = _idx * 1;//rdm.Next(10000);
            //Console.WriteLine("Begin " + _idx + " Execute " + Thread.CurrentThread.Name + " tempo = " + tempo);

            //Thread.Sleep(tempo);
            //Console.WriteLine("End " + _idx + " Execute " + Thread.CurrentThread.Name);
        }

        public void AfterExecute()
        {
            //Console.WriteLine("AfterExecute " + _idx + " - " + Thread.CurrentThread.Name);
        }

        //public object ContextObject { get; set; }
    }

    static class Program
    {
        static Stopwatch chrono;
        private static Mutex m;
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main(string[] param)
        {
            //bool ok;
            //m = new Mutex(true, "LogwatcherMutex", out ok);

            //if (!ok)
            //{
            //    //MessageBox.Show("Another instance is already running.");
            //    //Frm_Master.Singleton.LoadFileFromParam();
            //    //Frm_Master.Singleton.Focus();

            //    Process current = Process.GetCurrentProcess();

            //    return;
            //}

            Application.EnableVisualStyles();
            InstanceSingleton app = new InstanceSingleton();
            app.Run(param);
            

#if !DEBUG
            AppDomain.CurrentDomain.UnhandledException += OnUnhandledException;
#endif
            //Frm_Master.Singleton.LogsLoadByParam = new List<string>(param);
            //Application.Run(Frm_Master.Singleton);
            //GC.KeepAlive(m);                // important!
        }

        private static void OnUnhandledException(object sender, UnhandledExceptionEventArgs e)
        {
            try
            {
                //MessageBox.Show("aaaahhh");
                Exception ex = e.ExceptionObject as Exception;
                Trace.WriteLine(String.Format("{0} {1} : {2}", DateTime.Now.ToShortDateString(), DateTime.Now.ToLongTimeString(), ex.Message));
                Trace.WriteLine(String.Format("{0} {1} : {2}", DateTime.Now.ToShortDateString(), DateTime.Now.ToLongTimeString(), ex.StackTrace));

                if (ex.InnerException != null)
                {
                    Trace.WriteLine(String.Format("{0} {1} : {2}", DateTime.Now.ToShortDateString(), DateTime.Now.ToLongTimeString(), "InnerException : "));
                    Trace.WriteLine(String.Format("{0} {1} : {2}", DateTime.Now.ToShortDateString(), DateTime.Now.ToLongTimeString(), ex.InnerException.Message));
                    Trace.WriteLine(String.Format("{0} {1} : {2}", DateTime.Now.ToShortDateString(), DateTime.Now.ToLongTimeString(), ex.InnerException.StackTrace));
                }

                MessageBox.Show("An unhandled error occured. Please send LogWatcherError.log file to the developper for correction", "ERROR", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            catch (Exception ex)
            {
                MessageBox.Show("An error occured during the treatment of an unhandled error. " + ex.Message, "ERROR", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            //MessageBox.Show(e.ExceptionObject.ToString(), "ERROR", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }
}