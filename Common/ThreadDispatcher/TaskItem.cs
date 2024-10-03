using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace LogWatcher.Common.ThreadDispatcher
{
    public class DispatcherErrorEventArgs : EventArgs
    {
        public Exception CatchedException { get; private set; }
        public string DispatcherName { get; private set; }

        public DispatcherErrorEventArgs(string dispatcherName, Exception ex)
        {
            CatchedException = ex;
            DispatcherName = dispatcherName;
        }
    }

    public class TaskFinishedEventArgs : EventArgs
    {
        public object ContextObject { get; private set; }

        public TaskFinishedEventArgs(object contextObject)
        {
            ContextObject = contextObject;
        }
    }

    //public class TaskDispatcher : ITaskDispatcher
    //{
    //    int _idx;
    //    public TaskDispatcher(int idx)
    //    {
    //        _idx = idx;
    //    }

    //    //public void BeforeExecute()
    //    //{
    //    //}
    //    //Random rdm = new Random();
    //    public void Execute()
    //    {

    //        int tempo = _idx * 1000;//rdm.Next(10000);
    //        Console.WriteLine("Begin " + _idx + " Execute " + Thread.CurrentThread.Name + " tempo = " + tempo);

    //        Thread.Sleep(tempo);
    //        Console.WriteLine("End " + _idx + " Execute " + Thread.CurrentThread.Name);
    //    }

    //    public void AfterExecute()
    //    {
    //        Console.WriteLine("AfterExecute " + _idx + " - " + Thread.CurrentThread.Name);
    //    }

    //    public object ContextObject { get; set; } 
    //}

    public interface ITaskDispatcher
    {
        //object ContextObject { get; set; }
        //void BeforeExecute();
        void Execute();
        void AfterExecute();
    }

}