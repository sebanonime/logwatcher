using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;
using LogWatcher.Common;

namespace LogWatcher.Frm
{
    public partial class Frm_Alert : Form
    {
        private static readonly Frm_Alert _singleton = new Frm_Alert();

        public static Frm_Alert Singleton 
        {
            get { return _singleton; } 
        }

        private Frm_Alert()
        {
            InitializeComponent();
        }

        public void Show(int timeOut, string title, List<AlertMessage> allMessages)
        {
            Lbl_Title.Text = title;

            StringBuilder _allAlertString = new StringBuilder();
            foreach (AlertMessage message in allMessages)
            {
                _allAlertString.AppendLine(message.ToString());
            }

            Txt_Message.Text += "\r\n" + _allAlertString;
            Show();

            Top = Screen.PrimaryScreen.WorkingArea.Height - Height;
            Left = Screen.PrimaryScreen.WorkingArea.Width - Width;
        }

        private void Btn_Ok_Click(object sender, EventArgs e)
        {
            Txt_Message.Text = "";
            Hide();
        }
    }
}