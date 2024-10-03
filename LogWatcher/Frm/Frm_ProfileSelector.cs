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
    public partial class Frm_ProfileSelector : Form
    {
        private bool _buttonWasClicked;

        public Frm_ProfileSelector()
        {
            InitializeComponent();
        }

        private void Frm_ProfileSelector_Shown(object sender, EventArgs e)
        {
            BindingList<Profile> _allProfile = new BindingList<Profile>();

            foreach (Profile profile in LogConfig.Singleton.DicoProfile.Values)
            {
                _allProfile.Add(profile);
            }

            profileBindingSource.DataSource = _allProfile;
        }

        public Profile ShowProfileDialog(IWin32Window parent)
        {
            ShowDialog(parent);
            return (Profile)Lst_Profiles.SelectedItem;
        }

        private void Btn_Ok_Click(object sender, EventArgs e)
        {
            _buttonWasClicked = true;
            Close();
        }

        private void Btn_Cancel_Click(object sender, EventArgs e)
        {
            _buttonWasClicked = true;
            Lst_Profiles.SelectedItem = null;
            Close();
        }

        private void Lst_Profiles_MouseDoubleClick(object sender, MouseEventArgs e)
        {
            _buttonWasClicked = true;
            Close();
        }

        private void Frm_ProfileSelector_FormClosing(object sender, FormClosingEventArgs e)
        {
            if (!_buttonWasClicked)
                Lst_Profiles.SelectedItem = null;
        }

        
    }
}
