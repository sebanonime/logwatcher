using AvalonDock.VS2013Test.ViewModels;
using LogWatcher.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace VS2013Test.Views
{
    /// <summary>
    /// Interaction logic for LogPanelView.xaml
    /// </summary>
    public partial class LogPanelView : UserControl
    {
        public LogPanelView()
        {
            InitializeComponent();
            this.Loaded += OnLoaded;
        }

        public void OnLoaded(object sender, RoutedEventArgs e)
        {
            var viewModel = this.DataContext as LogPanelViewModel;
            viewModel.ScrollBottom += ViewModel_ScrollBottom;
            viewModel.ExecuteInGuiThread += ViewModel_ExecuteInGuiThread;
        }

        private void ViewModel_ExecuteInGuiThread(Action actionToExecute)
        {
            this.Dispatcher.BeginInvoke(new Action(() =>
            {
                actionToExecute?.Invoke();
            }));
        }

        private void ViewModel_ScrollBottom(LogRow row)
        {

            this.Dispatcher.BeginInvoke(new Action(() =>
            {
                if (this.dataGrid.Items.Count > 0)
                {
                    this.dataGrid.ScrollIntoView(this.dataGrid.Items[this.dataGrid.Items.Count - 1]);
                }
            }));
            
        }
    }
}
