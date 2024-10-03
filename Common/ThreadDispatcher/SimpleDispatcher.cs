using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace LogWatcher.Common.ThreadDispatcher
{
    

    public class SimpleDispatcher : IDisposable
    {
        #region Fields
        private Thread mainThread;
        private bool _isRunning = true;
        private int _threadInUse;
        //private object _syncThreadInUse = new object();
        private object _syncTask = new object();
        private AutoResetEvent _mre = new AutoResetEvent(false);
        private Queue<SimpleTask> _allTask = new Queue<SimpleTask>();
        //private List<Thread> _allThread = new List<Thread>();

        public delegate void DispatcherCallBack();

        public class SimpleTask
        {
            public DispatcherCallBack Method { get; set; }
            public object ContextObject{ get; set; }

            public SimpleTask(DispatcherCallBack method)
            {
                Method = method;
            }

            public SimpleTask(DispatcherCallBack method, object contextObject)
            {
                Method = method;
                ContextObject = contextObject;
            }
        }

        #endregion

        #region Properties
        public int NbrThread { get; private set; }
        public string DispatcherName { get; private set; } 
        #endregion

        #region Events
        public event EventHandler<DispatcherErrorEventArgs> UnhandleError;
        //public event EventHandler<EventArgs> AllTaskFinished;
        public event EventHandler<TaskFinishedEventArgs> TaskFinished;
        #endregion
        
        public SimpleDispatcher(int nbrThread, string dispatcherName)
        {
            DispatcherName = dispatcherName;
            NbrThread = nbrThread;

            //.ParameterizedThreadStart.new ParameterizedThreadStart(
            mainThread = new Thread(new ThreadStart(MainThreadProcess));
            mainThread.Name = DispatcherName + "_Main";
            mainThread.Start();

            //for (int i = 0; i < NbrThread; i++)
            //{
            //    Thread threadTmp = new Thread(new ParameterizedThreadStart(ExecuteThreadProcess)) { Name = DispatcherName + i };
            //    //threadTmp.Start();
            //    _allThread.Add(threadTmp);
            //}

            //Delegate toto;
            //toto.Method.Invoke
        }

        public void Dispatch(DispatcherCallBack task)
        {
            lock (_syncTask)
            {
                _allTask.Enqueue(new SimpleTask(task));
                //System.Diagnostics.Trace.WriteLine("Dispatch");
            }
            _mre.Set(); 
        }

        public void Dispatch(DispatcherCallBack task, object context)
        {
            lock (_syncTask)
            {
                _allTask.Enqueue(new SimpleTask(task, context));
                //Console.WriteLine("Dispatch");
                //System.Diagnostics.Trace.WriteLine("Dispatch");
            }
            _mre.Set();
        }

        private void ExecuteThreadProcess(object obj)
        {
            try
            {
                SimpleTask item = obj as SimpleTask;
                item.Method.Invoke();
                //if (DispatcherName =="PendingTaskDispatcher")
                //Console.WriteLine("------- ExecuteThreadProcess end  - DispatcherName={0} - ContextObject={1}", DispatcherName, item.ContextObject);
                
                //ThreadPool.QueueUserWorkItem(delegate
                //{
                    if (TaskFinished != null)
                        TaskFinished(this, new TaskFinishedEventArgs(item.ContextObject));
                //});
            }
            catch (ThreadAbortException) { }
            catch (Exception ex)
            {
                if (UnhandleError != null)
                    UnhandleError(this, new DispatcherErrorEventArgs(DispatcherName, ex));
            }
            finally
            {
                //Interlocked.Decrement(ref _threadInUse);
                lock (_syncTask)
                {
                    _threadInUse--;
                    _mre.Set();
                }
            }
        }

        private void MainThreadProcess()
        {

            do
            {
                _mre.WaitOne();
                //if (DispatcherName != "PendingTaskDispatcher")
                //Console.WriteLine("------- MainThreadProcess begin - DispatcherName={0} -_allTask.Count={1} - _threadInUse={2}", DispatcherName, _allTask.Count, _threadInUse);

                lock (_syncTask)
                {
                    SimpleTask item = null;

                    item = null;
                    bool threadIsDispo = TryGetFreeThread();
                    if (_allTask.Count > 0 && threadIsDispo)
                    {
                        item = _allTask.Dequeue();
                    }
                    if (item != null)
                    {
                        //if (DispatcherName != "PendingTaskDispatcher")
                        //Console.WriteLine("------- MainThreadProcess QueueUserWorkItem - DispatcherName={0} -_allTask.Count={1} - _threadInUse={2}", DispatcherName, _allTask.Count, _threadInUse);
                        ThreadPool.QueueUserWorkItem(ExecuteThreadProcess, item);
                        _threadInUse++;
                        //Console.WriteLine("MainThreadProcess start");
                    }
                    else
                    {
                        //if (DispatcherName != "PendingTaskDispatcher")
                        //    Console.WriteLine("------- MainThreadProcess thread pas dispo ou rien a faire - DispatcherName={0} -_allTask.Count={1} - _threadInUse={2}", DispatcherName, _allTask.Count, _threadInUse);
                    }
                }
            } while (_isRunning);
        }


        private bool TryGetFreeThread()
        {
            if (_threadInUse < NbrThread)
            {
                //Interlocked.Increment(ref _threadInUse);
                //_threadInUse++;
                return true;
            }
            return false;
        }

        public void Dispose()
        {
            _isRunning = false;
        }
    }
}
