using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace LogWatcher.Common.ThreadDispatcher
{
    public class SequencerDispatcher : IDisposable
    {
        #region Fields

        private ulong _index = 0;
        private SortedList<ulong, DispatcherItem> _allPendingTask = new SortedList<ulong, DispatcherItem>();
        private ulong _pendingTaskId;
        object _syncIndex = new object();
        object _syncPending = new object();
        private SimpleDispatcher _pendingTaskDispatcher = new SimpleDispatcher(1, "PendingTaskDispatcher");
        private SimpleDispatcher _executeTaskDispatcher;

        private class DispatcherItem
        {
            public ulong Index { get; set; }
            public ITaskDispatcher Task { get; set; }
            public object Context { get; set; }
        }

        #endregion

        #region Properties
        public int NbrThread { get; private set; }
        public string DispatcherName { get; private set; } 
        #endregion

        #region Event
        public event EventHandler<DispatcherErrorEventArgs> UnhandleError;
        public event EventHandler<TaskFinishedEventArgs> TaskFinished;
        #endregion

        public SequencerDispatcher(int nbrThread, string dispatcherName)
        {
            _pendingTaskId = 0;
            DispatcherName = dispatcherName;
            NbrThread = nbrThread;

            _executeTaskDispatcher = new SimpleDispatcher(nbrThread, dispatcherName);
            _executeTaskDispatcher.TaskFinished += new EventHandler<TaskFinishedEventArgs>(OnExecuteTaskFinished);
            _executeTaskDispatcher.UnhandleError += new EventHandler<DispatcherErrorEventArgs>(OnSimpleDispatcherUnhandleError);

            _pendingTaskDispatcher.TaskFinished += new EventHandler<TaskFinishedEventArgs>(OnPendingTaskFinished);
            _pendingTaskDispatcher.UnhandleError += new EventHandler<DispatcherErrorEventArgs>(OnSimpleDispatcherUnhandleError);
        }

        public void Dispatch(ITaskDispatcher task)
        {
            Dispatch(task, null);
        }

        public void Dispatch(ITaskDispatcher task, object context)
        {
            lock (_syncIndex)
            {
                DispatcherItem item = new DispatcherItem()
                {
                    Task = task,
                    Index = _index++,
                    Context = context
                };

                //Console.WriteLine("{0} Dispatch Context={1}", item.Index, item.Context);
                _executeTaskDispatcher.Dispatch(item.Task.Execute, item);
            }
        }
        
        void OnExecuteTaskFinished(object sender, TaskFinishedEventArgs e)
        {
            try
            {
                DispatcherItem item = e.ContextObject as DispatcherItem;

                if (item.Index == _pendingTaskId)
                {
                    //Console.WriteLine("{0} Dispatch PendingTask Context={1} - PendingTaskId={2}", item.Index, item.Context, _pendingTaskId);
                    _pendingTaskDispatcher.Dispatch(item.Task.AfterExecute, item);
                }
                else
                {
                    lock (_syncPending)
                    {
                        //Console.WriteLine("{0} Add to PendingTask Context={1} - PendingTaskId={2}", item.Index, item.Context, _pendingTaskId);
                        _allPendingTask.Add(item.Index, item);
                    }
                }

                //if (TaskFinished != null)
                //    TaskFinished(this, new TaskFinishedEventArgs(item.Context));
            }
            catch (ThreadAbortException) { }
            catch (Exception ex)
            {
                if (UnhandleError != null)
                    UnhandleError(this, new DispatcherErrorEventArgs(DispatcherName, ex));
            }
        }

        void OnPendingTaskFinished(object sender, TaskFinishedEventArgs e)
        {
            try
            {
                DispatcherItem item = e.ContextObject as DispatcherItem;

                //Console.WriteLine("{0} OnPendingTaskFinished Context={1} - PendingTaskId={2}", item.Index, item.Context, _pendingTaskId);

                lock (_syncIndex)
                {
                    _pendingTaskId = ++item.Index;
                }
                
                //ThreadPool.QueueUserWorkItem(delegate
                //{
                    if (TaskFinished != null)
                        TaskFinished(this, new TaskFinishedEventArgs(item.Context));
                //});

                lock (_syncPending)
                {
                    if (_allPendingTask.Count > 0)
                    {
                        int i = 0;
                        do
                        {
                            item = _allPendingTask.Values[i];
                            if (item.Index == _pendingTaskId)
                            {
                                //Console.WriteLine("{0} Dispatch PendingTask Context={1} - PendingTaskId={2}", item.Index, item.Context, _pendingTaskId);
                                _pendingTaskDispatcher.Dispatch(item.Task.AfterExecute, item);
                                _allPendingTask.Remove(item.Index);
                            }
                            i++;
                        } while (_allPendingTask.Count > i && item.Index == _pendingTaskId);
                    }                   
                }
            }
            catch (ThreadAbortException) { }
            catch (Exception ex)
            {
                if (UnhandleError != null)
                    UnhandleError(this, new DispatcherErrorEventArgs(DispatcherName, ex));
            }
        }

        void OnSimpleDispatcherUnhandleError(object sender, DispatcherErrorEventArgs e)
        {
            if (UnhandleError != null)
                UnhandleError(this, e);
        }
      
        public void Dispose()
        {
            _pendingTaskDispatcher.Dispose();
            _executeTaskDispatcher.Dispose();
        }
    }
}