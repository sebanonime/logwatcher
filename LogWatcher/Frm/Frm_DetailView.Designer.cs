namespace LogWatcher.Frm
{
    partial class Frm_DetailView
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
            this.tableLayoutPanel1 = new System.Windows.Forms.TableLayoutPanel();
            this.Txt_Details = new System.Windows.Forms.TextBox();
            this.flowLayoutPanel1 = new System.Windows.Forms.FlowLayoutPanel();
            this.label1 = new System.Windows.Forms.Label();
            this.Txt_Search = new System.Windows.Forms.TextBox();
            this.Btn_SearchOk = new System.Windows.Forms.Button();
            this.label2 = new System.Windows.Forms.Label();
            this.Lbl_Separator = new System.Windows.Forms.Label();
            this.Txt_Separator = new System.Windows.Forms.TextBox();
            this.Btn_SeparatorOk = new System.Windows.Forms.Button();
            this.Cb_ForceXml = new System.Windows.Forms.CheckBox();
            this.Cb_ShowOrg = new System.Windows.Forms.CheckBox();
            this.contextMenuStrip1 = new System.Windows.Forms.ContextMenuStrip(this.components);
            this.changeDispayedNameToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.tableLayoutPanel1.SuspendLayout();
            this.flowLayoutPanel1.SuspendLayout();
            this.contextMenuStrip1.SuspendLayout();
            this.SuspendLayout();
            // 
            // tableLayoutPanel1
            // 
            this.tableLayoutPanel1.ColumnCount = 1;
            this.tableLayoutPanel1.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 100F));
            this.tableLayoutPanel1.Controls.Add(this.Txt_Details, 0, 1);
            this.tableLayoutPanel1.Controls.Add(this.flowLayoutPanel1, 0, 0);
            this.tableLayoutPanel1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.tableLayoutPanel1.Location = new System.Drawing.Point(0, 0);
            this.tableLayoutPanel1.Name = "tableLayoutPanel1";
            this.tableLayoutPanel1.RowCount = 2;
            this.tableLayoutPanel1.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Absolute, 30F));
            this.tableLayoutPanel1.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 100F));
            this.tableLayoutPanel1.Size = new System.Drawing.Size(898, 508);
            this.tableLayoutPanel1.TabIndex = 1;
            // 
            // Txt_Details
            // 
            this.Txt_Details.Dock = System.Windows.Forms.DockStyle.Fill;
            this.Txt_Details.Location = new System.Drawing.Point(3, 33);
            this.Txt_Details.Multiline = true;
            this.Txt_Details.Name = "Txt_Details";
            this.Txt_Details.ScrollBars = System.Windows.Forms.ScrollBars.Both;
            this.Txt_Details.Size = new System.Drawing.Size(892, 472);
            this.Txt_Details.TabIndex = 2;
            // 
            // flowLayoutPanel1
            // 
            this.flowLayoutPanel1.Controls.Add(this.label1);
            this.flowLayoutPanel1.Controls.Add(this.Txt_Search);
            this.flowLayoutPanel1.Controls.Add(this.Btn_SearchOk);
            this.flowLayoutPanel1.Controls.Add(this.label2);
            this.flowLayoutPanel1.Controls.Add(this.Lbl_Separator);
            this.flowLayoutPanel1.Controls.Add(this.Txt_Separator);
            this.flowLayoutPanel1.Controls.Add(this.Btn_SeparatorOk);
            this.flowLayoutPanel1.Controls.Add(this.Cb_ForceXml);
            this.flowLayoutPanel1.Controls.Add(this.Cb_ShowOrg);
            this.flowLayoutPanel1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.flowLayoutPanel1.Location = new System.Drawing.Point(3, 3);
            this.flowLayoutPanel1.Name = "flowLayoutPanel1";
            this.flowLayoutPanel1.Size = new System.Drawing.Size(892, 24);
            this.flowLayoutPanel1.TabIndex = 1;
            // 
            // label1
            // 
            this.label1.Location = new System.Drawing.Point(3, 0);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(73, 23);
            this.label1.TabIndex = 2;
            this.label1.Text = "Search text :";
            this.label1.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            // 
            // Txt_Search
            // 
            this.Txt_Search.Location = new System.Drawing.Point(82, 3);
            this.Txt_Search.Name = "Txt_Search";
            this.Txt_Search.Size = new System.Drawing.Size(189, 20);
            this.Txt_Search.TabIndex = 1;
            this.Txt_Search.KeyUp += new System.Windows.Forms.KeyEventHandler(this.Txt_Search_KeyUp);
            // 
            // Btn_SearchOk
            // 
            this.Btn_SearchOk.Location = new System.Drawing.Point(277, 3);
            this.Btn_SearchOk.Name = "Btn_SearchOk";
            this.Btn_SearchOk.Size = new System.Drawing.Size(33, 20);
            this.Btn_SearchOk.TabIndex = 5;
            this.Btn_SearchOk.Text = "OK";
            this.Btn_SearchOk.UseVisualStyleBackColor = true;
            this.Btn_SearchOk.Click += new System.EventHandler(this.Btn_SearchOk_Click);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Dock = System.Windows.Forms.DockStyle.Left;
            this.label2.Location = new System.Drawing.Point(316, 0);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(98, 26);
            this.label2.TabIndex = 7;
            this.label2.Text = "(F3 for next search)";
            this.label2.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // Lbl_Separator
            // 
            this.Lbl_Separator.Dock = System.Windows.Forms.DockStyle.Left;
            this.Lbl_Separator.Location = new System.Drawing.Point(420, 0);
            this.Lbl_Separator.Name = "Lbl_Separator";
            this.Lbl_Separator.Size = new System.Drawing.Size(86, 26);
            this.Lbl_Separator.TabIndex = 0;
            this.Lbl_Separator.Text = "Text separator :";
            this.Lbl_Separator.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            // 
            // Txt_Separator
            // 
            this.Txt_Separator.Location = new System.Drawing.Point(512, 3);
            this.Txt_Separator.Name = "Txt_Separator";
            this.Txt_Separator.Size = new System.Drawing.Size(47, 20);
            this.Txt_Separator.TabIndex = 3;
            this.Txt_Separator.KeyUp += new System.Windows.Forms.KeyEventHandler(this.Txt_Separator_KeyUp);
            // 
            // Btn_SeparatorOk
            // 
            this.Btn_SeparatorOk.Location = new System.Drawing.Point(565, 3);
            this.Btn_SeparatorOk.Name = "Btn_SeparatorOk";
            this.Btn_SeparatorOk.Size = new System.Drawing.Size(33, 20);
            this.Btn_SeparatorOk.TabIndex = 2;
            this.Btn_SeparatorOk.Text = "OK";
            this.Btn_SeparatorOk.UseVisualStyleBackColor = true;
            this.Btn_SeparatorOk.Click += new System.EventHandler(this.Btn_SeparatorOk_Click);
            // 
            // Cb_ForceXml
            // 
            this.Cb_ForceXml.AutoSize = true;
            this.Cb_ForceXml.Dock = System.Windows.Forms.DockStyle.Left;
            this.Cb_ForceXml.Location = new System.Drawing.Point(604, 3);
            this.Cb_ForceXml.Name = "Cb_ForceXml";
            this.Cb_ForceXml.Size = new System.Drawing.Size(121, 20);
            this.Cb_ForceXml.TabIndex = 3;
            this.Cb_ForceXml.Text = "Format selected Xml";
            this.Cb_ForceXml.UseVisualStyleBackColor = true;
            this.Cb_ForceXml.CheckedChanged += new System.EventHandler(this.Cb_ForceXml_CheckedChanged);
            // 
            // Cb_ShowOrg
            // 
            this.Cb_ShowOrg.AutoSize = true;
            this.Cb_ShowOrg.Dock = System.Windows.Forms.DockStyle.Left;
            this.Cb_ShowOrg.Location = new System.Drawing.Point(731, 3);
            this.Cb_ShowOrg.Name = "Cb_ShowOrg";
            this.Cb_ShowOrg.Size = new System.Drawing.Size(111, 20);
            this.Cb_ShowOrg.TabIndex = 8;
            this.Cb_ShowOrg.Text = "Show Original text";
            this.Cb_ShowOrg.UseVisualStyleBackColor = true;
            this.Cb_ShowOrg.CheckedChanged += new System.EventHandler(this.Cb_ShowOrg_CheckedChanged);
            // 
            // contextMenuStrip1
            // 
            this.contextMenuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.changeDispayedNameToolStripMenuItem});
            this.contextMenuStrip1.Name = "contextMenuStrip1";
            this.contextMenuStrip1.Size = new System.Drawing.Size(199, 48);
            // 
            // changeDispayedNameToolStripMenuItem
            // 
            this.changeDispayedNameToolStripMenuItem.Name = "changeDispayedNameToolStripMenuItem";
            this.changeDispayedNameToolStripMenuItem.Size = new System.Drawing.Size(198, 22);
            this.changeDispayedNameToolStripMenuItem.Text = "Change dispayed name";
            this.changeDispayedNameToolStripMenuItem.Click += new System.EventHandler(this.changeDispayedNameToolStripMenuItem_Click);
            // 
            // Frm_DetailView
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(898, 508);
            this.Controls.Add(this.tableLayoutPanel1);
            this.Name = "Frm_DetailView";
            this.ShowIcon = false;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterParent;
            this.TabPageContextMenuStrip = this.contextMenuStrip1;
            this.TabText = "Log Detail View";
            this.Text = "Log Detail View";
            this.tableLayoutPanel1.ResumeLayout(false);
            this.tableLayoutPanel1.PerformLayout();
            this.flowLayoutPanel1.ResumeLayout(false);
            this.flowLayoutPanel1.PerformLayout();
            this.contextMenuStrip1.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.TableLayoutPanel tableLayoutPanel1;
        private System.Windows.Forms.FlowLayoutPanel flowLayoutPanel1;
        private System.Windows.Forms.Label Lbl_Separator;
        private System.Windows.Forms.TextBox Txt_Separator;
        private System.Windows.Forms.Button Btn_SeparatorOk;
        private System.Windows.Forms.CheckBox Cb_ForceXml;
        private System.Windows.Forms.TextBox Txt_Search;
        private System.Windows.Forms.Button Btn_SearchOk;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TextBox Txt_Details;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.CheckBox Cb_ShowOrg;
        private System.Windows.Forms.ContextMenuStrip contextMenuStrip1;
        private System.Windows.Forms.ToolStripMenuItem changeDispayedNameToolStripMenuItem;

    }
}