namespace LogWatcher
{
    partial class Frm_Doc
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
            this.components = new System.ComponentModel.Container();
            this.contextMenuStrip1 = new System.Windows.Forms.ContextMenuStrip(this.components);
            this.changeDispayedNameToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.Pnl_Container = new System.Windows.Forms.TableLayoutPanel();
            this.Lbl_Banner = new System.Windows.Forms.Label();
            this.Pnl_Loading = new System.Windows.Forms.Panel();
            this.Lbl_HiddenRows = new System.Windows.Forms.Label();
            this.label10 = new System.Windows.Forms.Label();
            this.Lbl_FileName = new System.Windows.Forms.Label();
            this.label8 = new System.Windows.Forms.Label();
            this.Lbl_FileSize = new System.Windows.Forms.Label();
            this.label6 = new System.Windows.Forms.Label();
            this.Lbl_Rows = new System.Windows.Forms.Label();
            this.label4 = new System.Windows.Forms.Label();
            this.Btn_StopLoading = new System.Windows.Forms.Button();
            this.label3 = new System.Windows.Forms.Label();
            this.Lbl_Filter = new System.Windows.Forms.Label();
            this.Lbl_Profile = new System.Windows.Forms.Label();
            this.label1 = new System.Windows.Forms.Label();
            this.Lbl_Loading = new System.Windows.Forms.Label();
            this.Pb_Loading = new System.Windows.Forms.ProgressBar();
            this.Lbl_CurrentLine = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.contextMenuStrip1.SuspendLayout();
            this.Pnl_Container.SuspendLayout();
            this.Pnl_Loading.SuspendLayout();
            this.SuspendLayout();
            // 
            // contextMenuStrip1
            // 
            this.contextMenuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.changeDispayedNameToolStripMenuItem});
            this.contextMenuStrip1.Name = "contextMenuStrip1";
            this.contextMenuStrip1.Size = new System.Drawing.Size(198, 26);
            // 
            // changeDispayedNameToolStripMenuItem
            // 
            this.changeDispayedNameToolStripMenuItem.Name = "changeDispayedNameToolStripMenuItem";
            this.changeDispayedNameToolStripMenuItem.Size = new System.Drawing.Size(197, 22);
            this.changeDispayedNameToolStripMenuItem.Text = "Change dispayed name";
            this.changeDispayedNameToolStripMenuItem.Click += new System.EventHandler(this.changeDispayedNameToolStripMenuItem_Click);
            // 
            // Pnl_Container
            // 
            this.Pnl_Container.ColumnCount = 1;
            this.Pnl_Container.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 100F));
            this.Pnl_Container.Controls.Add(this.Lbl_Banner, 0, 0);
            this.Pnl_Container.Dock = System.Windows.Forms.DockStyle.Fill;
            this.Pnl_Container.Location = new System.Drawing.Point(0, 0);
            this.Pnl_Container.Margin = new System.Windows.Forms.Padding(0);
            this.Pnl_Container.Name = "Pnl_Container";
            this.Pnl_Container.RowCount = 2;
            this.Pnl_Container.RowStyles.Add(new System.Windows.Forms.RowStyle());
            this.Pnl_Container.RowStyles.Add(new System.Windows.Forms.RowStyle());
            this.Pnl_Container.Size = new System.Drawing.Size(1086, 520);
            this.Pnl_Container.TabIndex = 1;
            // 
            // Lbl_Banner
            // 
            this.Lbl_Banner.BackColor = System.Drawing.Color.Gold;
            this.Lbl_Banner.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.Lbl_Banner.Dock = System.Windows.Forms.DockStyle.Fill;
            this.Lbl_Banner.Font = new System.Drawing.Font("Arial", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.Lbl_Banner.Location = new System.Drawing.Point(0, 0);
            this.Lbl_Banner.Margin = new System.Windows.Forms.Padding(0);
            this.Lbl_Banner.Name = "Lbl_Banner";
            this.Lbl_Banner.Size = new System.Drawing.Size(1086, 18);
            this.Lbl_Banner.TabIndex = 0;
            this.Lbl_Banner.Text = "label2";
            this.Lbl_Banner.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            this.Lbl_Banner.Visible = false;
            this.Lbl_Banner.DoubleClick += new System.EventHandler(this.Lbl_Banner_DoubleClick);
            // 
            // Pnl_Loading
            // 
            this.Pnl_Loading.Controls.Add(this.label2);
            this.Pnl_Loading.Controls.Add(this.label10);
            this.Pnl_Loading.Controls.Add(this.label4);
            this.Pnl_Loading.Controls.Add(this.Lbl_HiddenRows);
            this.Pnl_Loading.Controls.Add(this.Lbl_FileName);
            this.Pnl_Loading.Controls.Add(this.Lbl_CurrentLine);
            this.Pnl_Loading.Controls.Add(this.label8);
            this.Pnl_Loading.Controls.Add(this.Lbl_FileSize);
            this.Pnl_Loading.Controls.Add(this.label6);
            this.Pnl_Loading.Controls.Add(this.Lbl_Rows);
            this.Pnl_Loading.Controls.Add(this.Btn_StopLoading);
            this.Pnl_Loading.Controls.Add(this.label3);
            this.Pnl_Loading.Controls.Add(this.Lbl_Filter);
            this.Pnl_Loading.Controls.Add(this.Lbl_Profile);
            this.Pnl_Loading.Controls.Add(this.label1);
            this.Pnl_Loading.Controls.Add(this.Lbl_Loading);
            this.Pnl_Loading.Controls.Add(this.Pb_Loading);
            this.Pnl_Loading.Dock = System.Windows.Forms.DockStyle.Fill;
            this.Pnl_Loading.Location = new System.Drawing.Point(0, 0);
            this.Pnl_Loading.Name = "Pnl_Loading";
            this.Pnl_Loading.Size = new System.Drawing.Size(1086, 520);
            this.Pnl_Loading.TabIndex = 0;
            // 
            // Lbl_HiddenRows
            // 
            this.Lbl_HiddenRows.Anchor = System.Windows.Forms.AnchorStyles.Top;
            this.Lbl_HiddenRows.AutoSize = true;
            this.Lbl_HiddenRows.Location = new System.Drawing.Point(543, 243);
            this.Lbl_HiddenRows.Name = "Lbl_HiddenRows";
            this.Lbl_HiddenRows.Size = new System.Drawing.Size(33, 13);
            this.Lbl_HiddenRows.TabIndex = 14;
            this.Lbl_HiddenRows.Text = "None";
            // 
            // label10
            // 
            this.label10.Anchor = System.Windows.Forms.AnchorStyles.Top;
            this.label10.AutoSize = true;
            this.label10.Location = new System.Drawing.Point(472, 243);
            this.label10.Name = "label10";
            this.label10.Size = new System.Drawing.Size(72, 13);
            this.label10.TabIndex = 13;
            this.label10.Text = "Hidden rows :";
            // 
            // Lbl_FileName
            // 
            this.Lbl_FileName.Anchor = System.Windows.Forms.AnchorStyles.Top;
            this.Lbl_FileName.AutoSize = true;
            this.Lbl_FileName.Location = new System.Drawing.Point(543, 171);
            this.Lbl_FileName.Name = "Lbl_FileName";
            this.Lbl_FileName.Size = new System.Drawing.Size(33, 13);
            this.Lbl_FileName.TabIndex = 12;
            this.Lbl_FileName.Text = "None";
            // 
            // label8
            // 
            this.label8.Anchor = System.Windows.Forms.AnchorStyles.Top;
            this.label8.AutoSize = true;
            this.label8.Location = new System.Drawing.Point(484, 171);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(60, 13);
            this.label8.TabIndex = 11;
            this.label8.Text = "File Name :";
            // 
            // Lbl_FileSize
            // 
            this.Lbl_FileSize.Anchor = System.Windows.Forms.AnchorStyles.Top;
            this.Lbl_FileSize.AutoSize = true;
            this.Lbl_FileSize.Location = new System.Drawing.Point(543, 195);
            this.Lbl_FileSize.Name = "Lbl_FileSize";
            this.Lbl_FileSize.Size = new System.Drawing.Size(33, 13);
            this.Lbl_FileSize.TabIndex = 10;
            this.Lbl_FileSize.Text = "None";
            // 
            // label6
            // 
            this.label6.Anchor = System.Windows.Forms.AnchorStyles.Top;
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(494, 195);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(50, 13);
            this.label6.TabIndex = 9;
            this.label6.Text = "File size :";
            // 
            // Lbl_Rows
            // 
            this.Lbl_Rows.Anchor = System.Windows.Forms.AnchorStyles.Top;
            this.Lbl_Rows.AutoSize = true;
            this.Lbl_Rows.Location = new System.Drawing.Point(543, 219);
            this.Lbl_Rows.Name = "Lbl_Rows";
            this.Lbl_Rows.Size = new System.Drawing.Size(33, 13);
            this.Lbl_Rows.TabIndex = 8;
            this.Lbl_Rows.Text = "None";
            // 
            // label4
            // 
            this.label4.Anchor = System.Windows.Forms.AnchorStyles.Top;
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(504, 219);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(40, 13);
            this.label4.TabIndex = 7;
            this.label4.Text = "Rows :";
            // 
            // Btn_StopLoading
            // 
            this.Btn_StopLoading.Anchor = System.Windows.Forms.AnchorStyles.Top;
            this.Btn_StopLoading.Location = new System.Drawing.Point(480, 323);
            this.Btn_StopLoading.Name = "Btn_StopLoading";
            this.Btn_StopLoading.Size = new System.Drawing.Size(126, 23);
            this.Btn_StopLoading.TabIndex = 6;
            this.Btn_StopLoading.Text = "Abort Loading";
            this.Btn_StopLoading.UseVisualStyleBackColor = true;
            this.Btn_StopLoading.Click += new System.EventHandler(this.Btn_StopLoading_Click);
            // 
            // label3
            // 
            this.label3.Anchor = System.Windows.Forms.AnchorStyles.Top;
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(510, 371);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(35, 13);
            this.label3.TabIndex = 5;
            this.label3.Text = "Filter :";
            this.label3.Visible = false;
            // 
            // Lbl_Filter
            // 
            this.Lbl_Filter.Anchor = System.Windows.Forms.AnchorStyles.Top;
            this.Lbl_Filter.AutoSize = true;
            this.Lbl_Filter.Location = new System.Drawing.Point(551, 371);
            this.Lbl_Filter.Name = "Lbl_Filter";
            this.Lbl_Filter.Size = new System.Drawing.Size(33, 13);
            this.Lbl_Filter.TabIndex = 4;
            this.Lbl_Filter.Text = "None";
            this.Lbl_Filter.Visible = false;
            // 
            // Lbl_Profile
            // 
            this.Lbl_Profile.Anchor = System.Windows.Forms.AnchorStyles.Top;
            this.Lbl_Profile.AutoSize = true;
            this.Lbl_Profile.Location = new System.Drawing.Point(543, 147);
            this.Lbl_Profile.Name = "Lbl_Profile";
            this.Lbl_Profile.Size = new System.Drawing.Size(33, 13);
            this.Lbl_Profile.TabIndex = 3;
            this.Lbl_Profile.Text = "None";
            // 
            // label1
            // 
            this.label1.Anchor = System.Windows.Forms.AnchorStyles.Top;
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(502, 147);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(42, 13);
            this.label1.TabIndex = 2;
            this.label1.Text = "Profile :";
            // 
            // Lbl_Loading
            // 
            this.Lbl_Loading.Anchor = System.Windows.Forms.AnchorStyles.Top;
            this.Lbl_Loading.Font = new System.Drawing.Font("Microsoft Sans Serif", 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.Lbl_Loading.Location = new System.Drawing.Point(423, 47);
            this.Lbl_Loading.Name = "Lbl_Loading";
            this.Lbl_Loading.Size = new System.Drawing.Size(240, 31);
            this.Lbl_Loading.TabIndex = 1;
            this.Lbl_Loading.Text = "Loading ...";
            this.Lbl_Loading.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // Pb_Loading
            // 
            this.Pb_Loading.Anchor = System.Windows.Forms.AnchorStyles.Top;
            this.Pb_Loading.Location = new System.Drawing.Point(380, 89);
            this.Pb_Loading.Name = "Pb_Loading";
            this.Pb_Loading.Size = new System.Drawing.Size(326, 41);
            this.Pb_Loading.TabIndex = 0;
            // 
            // Lbl_CurrentLine
            // 
            this.Lbl_CurrentLine.Anchor = System.Windows.Forms.AnchorStyles.Top;
            this.Lbl_CurrentLine.AutoSize = true;
            this.Lbl_CurrentLine.Location = new System.Drawing.Point(543, 267);
            this.Lbl_CurrentLine.MaximumSize = new System.Drawing.Size(530, 50);
            this.Lbl_CurrentLine.Name = "Lbl_CurrentLine";
            this.Lbl_CurrentLine.Size = new System.Drawing.Size(33, 13);
            this.Lbl_CurrentLine.TabIndex = 15;
            this.Lbl_CurrentLine.Text = "None";
            // 
            // label2
            // 
            this.label2.Anchor = System.Windows.Forms.AnchorStyles.Top;
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(473, 267);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(71, 13);
            this.label2.TabIndex = 16;
            this.label2.Text = "Loading row :";
            // 
            // Frm_Doc
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.AutoScroll = true;
            this.BackColor = System.Drawing.SystemColors.Control;
            this.ClientSize = new System.Drawing.Size(1086, 520);
            this.Controls.Add(this.Pnl_Loading);
            this.Controls.Add(this.Pnl_Container);
            this.DockAreas = ((WeifenLuo.WinFormsUI.Docking.DockAreas)(((((WeifenLuo.WinFormsUI.Docking.DockAreas.DockLeft | WeifenLuo.WinFormsUI.Docking.DockAreas.DockRight)
                        | WeifenLuo.WinFormsUI.Docking.DockAreas.DockTop)
                        | WeifenLuo.WinFormsUI.Docking.DockAreas.DockBottom)
                        | WeifenLuo.WinFormsUI.Docking.DockAreas.Document)));
            this.Name = "Frm_Doc";
            this.ShowHint = WeifenLuo.WinFormsUI.Docking.DockState.Document;
            this.TabPageContextMenuStrip = this.contextMenuStrip1;
            this.TabText = "Doc";
            this.Text = "Frm_Doc";
            this.Shown += new System.EventHandler(this.Frm_Doc_Shown);
            this.contextMenuStrip1.ResumeLayout(false);
            this.Pnl_Container.ResumeLayout(false);
            this.Pnl_Loading.ResumeLayout(false);
            this.Pnl_Loading.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.ContextMenuStrip contextMenuStrip1;
        private System.Windows.Forms.ToolStripMenuItem changeDispayedNameToolStripMenuItem;
        private System.Windows.Forms.TableLayoutPanel Pnl_Container;
        private System.Windows.Forms.Panel Pnl_Loading;
        private System.Windows.Forms.ProgressBar Pb_Loading;
        private System.Windows.Forms.Label Lbl_Loading;
        private System.Windows.Forms.Label Lbl_Profile;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label Lbl_Filter;
        private System.Windows.Forms.Button Btn_StopLoading;
        private System.Windows.Forms.Label Lbl_Banner;
        private System.Windows.Forms.Label Lbl_HiddenRows;
        private System.Windows.Forms.Label label10;
        private System.Windows.Forms.Label Lbl_FileName;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.Label Lbl_FileSize;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.Label Lbl_Rows;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label Lbl_CurrentLine;



    }
}