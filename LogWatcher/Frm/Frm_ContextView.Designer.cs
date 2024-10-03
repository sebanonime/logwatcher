namespace LogWatcher.Frm
{
    partial class Frm_ContextView
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
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle3 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle4 = new System.Windows.Forms.DataGridViewCellStyle();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Frm_ContextView));
            this.Dgv_ContextView = new System.Windows.Forms.DataGridView();
            this.Message = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.toolStrip1 = new System.Windows.Forms.ToolStrip();
            this.Btn_Previous = new System.Windows.Forms.ToolStripButton();
            this.Btn_Next = new System.Windows.Forms.ToolStripButton();
            this.toolStripSeparator1 = new System.Windows.Forms.ToolStripSeparator();
            this.Btn_DetailView = new System.Windows.Forms.ToolStripButton();
            this.menuStrip1 = new System.Windows.Forms.MenuStrip();
            this.toolStripMenuItem1 = new System.Windows.Forms.ToolStripMenuItem();
            this.detailViewToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.Btn_Cancel = new System.Windows.Forms.Button();
            ((System.ComponentModel.ISupportInitialize)(this.Dgv_ContextView)).BeginInit();
            this.toolStrip1.SuspendLayout();
            this.menuStrip1.SuspendLayout();
            this.SuspendLayout();
            // 
            // Dgv_ContextView
            // 
            this.Dgv_ContextView.AllowUserToAddRows = false;
            this.Dgv_ContextView.AllowUserToDeleteRows = false;
            this.Dgv_ContextView.AllowUserToResizeColumns = false;
            this.Dgv_ContextView.AllowUserToResizeRows = false;
            this.Dgv_ContextView.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom)
                        | System.Windows.Forms.AnchorStyles.Left)
                        | System.Windows.Forms.AnchorStyles.Right)));
            this.Dgv_ContextView.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.Fill;
            this.Dgv_ContextView.AutoSizeRowsMode = System.Windows.Forms.DataGridViewAutoSizeRowsMode.AllCells;
            this.Dgv_ContextView.CellBorderStyle = System.Windows.Forms.DataGridViewCellBorderStyle.None;
            dataGridViewCellStyle3.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle3.BackColor = System.Drawing.SystemColors.Control;
            dataGridViewCellStyle3.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            dataGridViewCellStyle3.ForeColor = System.Drawing.SystemColors.WindowText;
            dataGridViewCellStyle3.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle3.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle3.WrapMode = System.Windows.Forms.DataGridViewTriState.False;
            this.Dgv_ContextView.ColumnHeadersDefaultCellStyle = dataGridViewCellStyle3;
            this.Dgv_ContextView.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.Dgv_ContextView.ColumnHeadersVisible = false;
            this.Dgv_ContextView.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.Message});
            this.Dgv_ContextView.Location = new System.Drawing.Point(0, 25);
            this.Dgv_ContextView.Name = "Dgv_ContextView";
            this.Dgv_ContextView.RowHeadersVisible = false;
            this.Dgv_ContextView.RowHeadersWidthSizeMode = System.Windows.Forms.DataGridViewRowHeadersWidthSizeMode.DisableResizing;
            this.Dgv_ContextView.RowTemplate.DefaultCellStyle.WrapMode = System.Windows.Forms.DataGridViewTriState.False;
            this.Dgv_ContextView.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.Dgv_ContextView.ShowCellErrors = false;
            this.Dgv_ContextView.ShowCellToolTips = false;
            this.Dgv_ContextView.ShowEditingIcon = false;
            this.Dgv_ContextView.ShowRowErrors = false;
            this.Dgv_ContextView.Size = new System.Drawing.Size(710, 506);
            this.Dgv_ContextView.TabIndex = 0;
            // 
            // Message
            // 
            this.Message.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.None;
            dataGridViewCellStyle4.WrapMode = System.Windows.Forms.DataGridViewTriState.False;
            this.Message.DefaultCellStyle = dataGridViewCellStyle4;
            this.Message.HeaderText = "Message";
            this.Message.Name = "Message";
            this.Message.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            this.Message.Width = 20000;
            // 
            // toolStrip1
            // 
            this.toolStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.Btn_Previous,
            this.Btn_Next,
            this.toolStripSeparator1,
            this.Btn_DetailView});
            this.toolStrip1.Location = new System.Drawing.Point(0, 0);
            this.toolStrip1.Name = "toolStrip1";
            this.toolStrip1.Size = new System.Drawing.Size(710, 25);
            this.toolStrip1.TabIndex = 1;
            this.toolStrip1.Text = "toolStrip1";
            // 
            // Btn_Previous
            // 
            this.Btn_Previous.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.Btn_Previous.Image = ((System.Drawing.Image)(resources.GetObject("Btn_Previous.Image")));
            this.Btn_Previous.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.Btn_Previous.Name = "Btn_Previous";
            this.Btn_Previous.Size = new System.Drawing.Size(23, 22);
            this.Btn_Previous.Text = "toolStripButton1";
            this.Btn_Previous.ToolTipText = "Up in the context ";
            this.Btn_Previous.Click += new System.EventHandler(this.Btn_Previous_Click);
            // 
            // Btn_Next
            // 
            this.Btn_Next.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.Btn_Next.Image = global::LogWatcher.Properties.Resources.Download;
            this.Btn_Next.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.Btn_Next.Name = "Btn_Next";
            this.Btn_Next.Size = new System.Drawing.Size(23, 22);
            this.Btn_Next.Text = "toolStripButton1";
            this.Btn_Next.ToolTipText = "Down in the context ";
            this.Btn_Next.Click += new System.EventHandler(this.Btn_Next_Click);
            // 
            // toolStripSeparator1
            // 
            this.toolStripSeparator1.Name = "toolStripSeparator1";
            this.toolStripSeparator1.Size = new System.Drawing.Size(6, 25);
            // 
            // Btn_DetailView
            // 
            this.Btn_DetailView.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.Btn_DetailView.Image = global::LogWatcher.Properties.Resources.Search;
            this.Btn_DetailView.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.Btn_DetailView.Name = "Btn_DetailView";
            this.Btn_DetailView.Size = new System.Drawing.Size(23, 22);
            this.Btn_DetailView.Text = "toolStripButton1";
            this.Btn_DetailView.Click += new System.EventHandler(this.Btn_DetailView_Click);
            // 
            // menuStrip1
            // 
            this.menuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.toolStripMenuItem1});
            this.menuStrip1.Location = new System.Drawing.Point(0, 0);
            this.menuStrip1.Name = "menuStrip1";
            this.menuStrip1.Size = new System.Drawing.Size(710, 24);
            this.menuStrip1.TabIndex = 2;
            this.menuStrip1.Text = "menuStrip1";
            this.menuStrip1.Visible = false;
            // 
            // toolStripMenuItem1
            // 
            this.toolStripMenuItem1.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.detailViewToolStripMenuItem});
            this.toolStripMenuItem1.Name = "toolStripMenuItem1";
            this.toolStripMenuItem1.Size = new System.Drawing.Size(125, 20);
            this.toolStripMenuItem1.Text = "toolStripMenuItem1";
            // 
            // detailViewToolStripMenuItem
            // 
            this.detailViewToolStripMenuItem.Name = "detailViewToolStripMenuItem";
            this.detailViewToolStripMenuItem.ShortcutKeys = ((System.Windows.Forms.Keys)((System.Windows.Forms.Keys.Control | System.Windows.Forms.Keys.D)));
            this.detailViewToolStripMenuItem.Size = new System.Drawing.Size(174, 22);
            this.detailViewToolStripMenuItem.Text = "Detail View";
            this.detailViewToolStripMenuItem.Click += new System.EventHandler(this.detailViewToolStripMenuItem_Click);
            // 
            // Btn_Cancel
            // 
            this.Btn_Cancel.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.Btn_Cancel.DialogResult = System.Windows.Forms.DialogResult.Cancel;
            this.Btn_Cancel.Location = new System.Drawing.Point(662, 0);
            this.Btn_Cancel.Name = "Btn_Cancel";
            this.Btn_Cancel.Size = new System.Drawing.Size(48, 23);
            this.Btn_Cancel.TabIndex = 3;
            this.Btn_Cancel.Text = "Close";
            this.Btn_Cancel.UseVisualStyleBackColor = true;
            this.Btn_Cancel.Click += new System.EventHandler(this.Btn_Cancel_Click);
            // 
            // Frm_ContextView
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.CancelButton = this.Btn_Cancel;
            this.ClientSize = new System.Drawing.Size(710, 531);
            this.Controls.Add(this.Btn_Cancel);
            this.Controls.Add(this.toolStrip1);
            this.Controls.Add(this.menuStrip1);
            this.Controls.Add(this.Dgv_ContextView);
            this.MainMenuStrip = this.menuStrip1;
            this.Name = "Frm_ContextView";
            this.ShowIcon = false;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterParent;
            this.Text = "Log Context View";
            this.Shown += new System.EventHandler(this.Frm_ContextView_Shown);
            ((System.ComponentModel.ISupportInitialize)(this.Dgv_ContextView)).EndInit();
            this.toolStrip1.ResumeLayout(false);
            this.toolStrip1.PerformLayout();
            this.menuStrip1.ResumeLayout(false);
            this.menuStrip1.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.DataGridView Dgv_ContextView;
        private System.Windows.Forms.ToolStrip toolStrip1;
        private System.Windows.Forms.ToolStripButton Btn_Previous;
        private System.Windows.Forms.ToolStripButton Btn_Next;
        private System.Windows.Forms.ToolStripSeparator toolStripSeparator1;
        private System.Windows.Forms.DataGridViewTextBoxColumn Message;
        private System.Windows.Forms.ToolStripButton Btn_DetailView;
        private System.Windows.Forms.MenuStrip menuStrip1;
        private System.Windows.Forms.ToolStripMenuItem toolStripMenuItem1;
        private System.Windows.Forms.ToolStripMenuItem detailViewToolStripMenuItem;
        private System.Windows.Forms.Button Btn_Cancel;
    }
}