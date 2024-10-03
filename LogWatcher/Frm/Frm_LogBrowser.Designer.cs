namespace LogWatcher.Frm
{
    partial class Frm_LogBrowser
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components;

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
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Frm_LogBrowser));
            this.Tv_LogBrowser = new System.Windows.Forms.TreeView();
            this.Il_TreeNode = new System.Windows.Forms.ImageList(this.components);
            this.Cb_Lb_ShowAll = new System.Windows.Forms.CheckBox();
            this.Lbl_Loading = new System.Windows.Forms.Label();
            this.CtxMenu_Folder = new System.Windows.Forms.ContextMenuStrip(this.components);
            this.Tsmi_OpenContainFolder = new System.Windows.Forms.ToolStripMenuItem();
            this.CtxMenu_File = new System.Windows.Forms.ContextMenuStrip(this.components);
            this.toolStripMenuItem1 = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripMenuItem2 = new System.Windows.Forms.ToolStripMenuItem();
            this.panel1 = new System.Windows.Forms.Panel();
            this.Btn_Refresh = new System.Windows.Forms.Button();
            this.CtxMenu_Folder.SuspendLayout();
            this.CtxMenu_File.SuspendLayout();
            this.panel1.SuspendLayout();
            this.SuspendLayout();
            // 
            // Tv_LogBrowser
            // 
            this.Tv_LogBrowser.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom)
                        | System.Windows.Forms.AnchorStyles.Left)
                        | System.Windows.Forms.AnchorStyles.Right)));
            this.Tv_LogBrowser.ImageIndex = 0;
            this.Tv_LogBrowser.ImageList = this.Il_TreeNode;
            this.Tv_LogBrowser.Location = new System.Drawing.Point(0, 35);
            this.Tv_LogBrowser.Margin = new System.Windows.Forms.Padding(0);
            this.Tv_LogBrowser.Name = "Tv_LogBrowser";
            this.Tv_LogBrowser.SelectedImageIndex = 2;
            this.Tv_LogBrowser.Size = new System.Drawing.Size(191, 227);
            this.Tv_LogBrowser.StateImageList = this.Il_TreeNode;
            this.Tv_LogBrowser.TabIndex = 0;
            this.Tv_LogBrowser.BeforeExpand += new System.Windows.Forms.TreeViewCancelEventHandler(this.Tv_LogBrowser_BeforeExpand);
            this.Tv_LogBrowser.MouseDoubleClick += new System.Windows.Forms.MouseEventHandler(this.Tv_LogBrowser_MouseDoubleClick);
            this.Tv_LogBrowser.MouseUp += new System.Windows.Forms.MouseEventHandler(this.Tv_LogBrowser_MouseUp);
            // 
            // Il_TreeNode
            // 
            this.Il_TreeNode.ImageStream = ((System.Windows.Forms.ImageListStreamer)(resources.GetObject("Il_TreeNode.ImageStream")));
            this.Il_TreeNode.TransparentColor = System.Drawing.Color.Transparent;
            this.Il_TreeNode.Images.SetKeyName(0, "Open_Folder.ico");
            this.Il_TreeNode.Images.SetKeyName(1, "Closed_Folder.ico");
            this.Il_TreeNode.Images.SetKeyName(2, "File_Text_Document.ico");
            this.Il_TreeNode.Images.SetKeyName(3, "Open_Folder_yellow.ico");
            this.Il_TreeNode.Images.SetKeyName(4, "DocumentNotExist.ico");
            // 
            // Cb_Lb_ShowAll
            // 
            this.Cb_Lb_ShowAll.AutoSize = true;
            this.Cb_Lb_ShowAll.Location = new System.Drawing.Point(5, 9);
            this.Cb_Lb_ShowAll.Margin = new System.Windows.Forms.Padding(5, 3, 0, 0);
            this.Cb_Lb_ShowAll.Name = "Cb_Lb_ShowAll";
            this.Cb_Lb_ShowAll.Size = new System.Drawing.Size(87, 17);
            this.Cb_Lb_ShowAll.TabIndex = 3;
            this.Cb_Lb_ShowAll.Text = "Show all files";
            this.Cb_Lb_ShowAll.UseVisualStyleBackColor = true;
            this.Cb_Lb_ShowAll.CheckedChanged += new System.EventHandler(this.Cb_Lb_ShowAll_CheckedChanged);
            // 
            // Lbl_Loading
            // 
            this.Lbl_Loading.Anchor = System.Windows.Forms.AnchorStyles.Top;
            this.Lbl_Loading.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.Lbl_Loading.Font = new System.Drawing.Font("Microsoft Sans Serif", 10F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.Lbl_Loading.Image = global::LogWatcher.Properties.Resources.RefreshBig;
            this.Lbl_Loading.ImageAlign = System.Drawing.ContentAlignment.MiddleLeft;
            this.Lbl_Loading.Location = new System.Drawing.Point(35, 80);
            this.Lbl_Loading.Name = "Lbl_Loading";
            this.Lbl_Loading.Size = new System.Drawing.Size(126, 54);
            this.Lbl_Loading.TabIndex = 4;
            this.Lbl_Loading.Text = "Loading ...";
            this.Lbl_Loading.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            this.Lbl_Loading.Visible = false;
            // 
            // CtxMenu_Folder
            // 
            this.CtxMenu_Folder.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.Tsmi_OpenContainFolder});
            this.CtxMenu_Folder.Name = "CtxMenu_Folder";
            this.CtxMenu_Folder.Size = new System.Drawing.Size(202, 26);
            // 
            // Tsmi_OpenContainFolder
            // 
            this.Tsmi_OpenContainFolder.Name = "Tsmi_OpenContainFolder";
            this.Tsmi_OpenContainFolder.Size = new System.Drawing.Size(201, 22);
            this.Tsmi_OpenContainFolder.Text = "Open Containing Folder";
            this.Tsmi_OpenContainFolder.Click += new System.EventHandler(this.OpenContainFolder_Click);
            // 
            // CtxMenu_File
            // 
            this.CtxMenu_File.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.toolStripMenuItem1,
            this.toolStripMenuItem2});
            this.CtxMenu_File.Name = "Cms_CtxMenuFolder";
            this.CtxMenu_File.Size = new System.Drawing.Size(202, 48);
            // 
            // toolStripMenuItem1
            // 
            this.toolStripMenuItem1.Name = "toolStripMenuItem1";
            this.toolStripMenuItem1.Size = new System.Drawing.Size(201, 22);
            this.toolStripMenuItem1.Text = "Open Containing Folder";
            this.toolStripMenuItem1.Click += new System.EventHandler(this.OpenContainFolder_Click);
            // 
            // toolStripMenuItem2
            // 
            this.toolStripMenuItem2.Name = "toolStripMenuItem2";
            this.toolStripMenuItem2.Size = new System.Drawing.Size(201, 22);
            this.toolStripMenuItem2.Text = "Open with filter";
            this.toolStripMenuItem2.Click += new System.EventHandler(this.OpenWithFilter_Click);
            // 
            // panel1
            // 
            this.panel1.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left)
                        | System.Windows.Forms.AnchorStyles.Right)));
            this.panel1.Controls.Add(this.Btn_Refresh);
            this.panel1.Controls.Add(this.Cb_Lb_ShowAll);
            this.panel1.Location = new System.Drawing.Point(0, 0);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(191, 35);
            this.panel1.TabIndex = 5;
            // 
            // Btn_Refresh
            // 
            this.Btn_Refresh.Anchor = System.Windows.Forms.AnchorStyles.Right;
            this.Btn_Refresh.AutoSize = true;
            this.Btn_Refresh.Image = ((System.Drawing.Image)(resources.GetObject("Btn_Refresh.Image")));
            this.Btn_Refresh.ImageAlign = System.Drawing.ContentAlignment.MiddleLeft;
            this.Btn_Refresh.Location = new System.Drawing.Point(109, 3);
            this.Btn_Refresh.Name = "Btn_Refresh";
            this.Btn_Refresh.Size = new System.Drawing.Size(79, 30);
            this.Btn_Refresh.TabIndex = 5;
            this.Btn_Refresh.Text = "Refresh";
            this.Btn_Refresh.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            this.Btn_Refresh.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageBeforeText;
            this.Btn_Refresh.UseVisualStyleBackColor = true;
            this.Btn_Refresh.Click += new System.EventHandler(this.Btn_Refresh_Click);
            // 
            // Frm_LogBrowser
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(191, 262);
            this.Controls.Add(this.Lbl_Loading);
            this.Controls.Add(this.panel1);
            this.Controls.Add(this.Tv_LogBrowser);
            this.Name = "Frm_LogBrowser";
            this.TabText = "Log Browser";
            this.Text = "Log Browser";
            this.FormClosed += new System.Windows.Forms.FormClosedEventHandler(this.Frm_LogBrowser_FormClosed);
            this.Shown += new System.EventHandler(this.Frm_LogBrowser_Shown);
            this.CtxMenu_Folder.ResumeLayout(false);
            this.CtxMenu_File.ResumeLayout(false);
            this.panel1.ResumeLayout(false);
            this.panel1.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.TreeView Tv_LogBrowser;
        private System.Windows.Forms.ImageList Il_TreeNode;
        private System.Windows.Forms.CheckBox Cb_Lb_ShowAll;
        private System.Windows.Forms.ContextMenuStrip CtxMenu_Folder;
        private System.Windows.Forms.ToolStripMenuItem Tsmi_OpenContainFolder;
        private System.Windows.Forms.ContextMenuStrip CtxMenu_File;
        private System.Windows.Forms.ToolStripMenuItem toolStripMenuItem1;
        private System.Windows.Forms.ToolStripMenuItem toolStripMenuItem2;
        private System.Windows.Forms.Label Lbl_Loading;
        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.Button Btn_Refresh;
    }
}