namespace LogWatcher.Frm
{
    partial class Frm_DetailViewMaster
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Frm_DetailViewMaster));
            this.DckPnl_Detail = new WeifenLuo.WinFormsUI.Docking.DockPanel();
            this.menuStrip1 = new System.Windows.Forms.MenuStrip();
            this.utilsToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.selectAllToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.searchToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.searchNextToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.menuStrip1.SuspendLayout();
            this.SuspendLayout();
            // 
            // DckPnl_Detail
            // 
            this.DckPnl_Detail.ActiveAutoHideContent = null;
            this.DckPnl_Detail.AllowDrop = true;
            this.DckPnl_Detail.Dock = System.Windows.Forms.DockStyle.Fill;
            this.DckPnl_Detail.DocumentStyle = WeifenLuo.WinFormsUI.Docking.DocumentStyle.DockingWindow;
            this.DckPnl_Detail.Location = new System.Drawing.Point(0, 0);
            this.DckPnl_Detail.Name = "DckPnl_Detail";
            this.DckPnl_Detail.ShowDocumentIcon = true;
            this.DckPnl_Detail.Size = new System.Drawing.Size(971, 544);
            this.DckPnl_Detail.TabIndex = 6;
            // 
            // menuStrip1
            // 
            this.menuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.utilsToolStripMenuItem});
            this.menuStrip1.Location = new System.Drawing.Point(0, 0);
            this.menuStrip1.Name = "menuStrip1";
            this.menuStrip1.Size = new System.Drawing.Size(971, 24);
            this.menuStrip1.TabIndex = 7;
            this.menuStrip1.Text = "menuStrip1";
            this.menuStrip1.Visible = false;
            // 
            // utilsToolStripMenuItem
            // 
            this.utilsToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.selectAllToolStripMenuItem,
            this.searchToolStripMenuItem,
            this.searchNextToolStripMenuItem});
            this.utilsToolStripMenuItem.Name = "utilsToolStripMenuItem";
            this.utilsToolStripMenuItem.Size = new System.Drawing.Size(42, 20);
            this.utilsToolStripMenuItem.Text = "Utils";
            // 
            // selectAllToolStripMenuItem
            // 
            this.selectAllToolStripMenuItem.Name = "selectAllToolStripMenuItem";
            this.selectAllToolStripMenuItem.ShortcutKeys = ((System.Windows.Forms.Keys)((System.Windows.Forms.Keys.Control | System.Windows.Forms.Keys.A)));
            this.selectAllToolStripMenuItem.Size = new System.Drawing.Size(162, 22);
            this.selectAllToolStripMenuItem.Text = "Select all";
            this.selectAllToolStripMenuItem.Click += new System.EventHandler(this.selectAllToolStripMenuItem_Click);
            // 
            // searchToolStripMenuItem
            // 
            this.searchToolStripMenuItem.Name = "searchToolStripMenuItem";
            this.searchToolStripMenuItem.ShortcutKeys = System.Windows.Forms.Keys.F5;
            this.searchToolStripMenuItem.Size = new System.Drawing.Size(162, 22);
            this.searchToolStripMenuItem.Text = "Search";
            this.searchToolStripMenuItem.Click += new System.EventHandler(this.searchToolStripMenuItem_Click);
            // 
            // searchNextToolStripMenuItem
            // 
            this.searchNextToolStripMenuItem.Name = "searchNextToolStripMenuItem";
            this.searchNextToolStripMenuItem.ShortcutKeys = System.Windows.Forms.Keys.F3;
            this.searchNextToolStripMenuItem.Size = new System.Drawing.Size(162, 22);
            this.searchNextToolStripMenuItem.Text = "Search next";
            this.searchNextToolStripMenuItem.Click += new System.EventHandler(this.searchNextToolStripMenuItem_Click);
            // 
            // Frm_DetailViewMaster
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(971, 544);
            this.Controls.Add(this.DckPnl_Detail);
            this.Controls.Add(this.menuStrip1);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MainMenuStrip = this.menuStrip1;
            this.Name = "Frm_DetailViewMaster";
            this.Text = "Detail View";
            this.Activated += new System.EventHandler(this.Frm_DetailViewMaster_Activated);
            this.Shown += new System.EventHandler(this.Frm_DetailViewMaster_Shown);
            this.menuStrip1.ResumeLayout(false);
            this.menuStrip1.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private WeifenLuo.WinFormsUI.Docking.DockPanel DckPnl_Detail;
        private System.Windows.Forms.MenuStrip menuStrip1;
        private System.Windows.Forms.ToolStripMenuItem utilsToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem selectAllToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem searchToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem searchNextToolStripMenuItem;
    }
}