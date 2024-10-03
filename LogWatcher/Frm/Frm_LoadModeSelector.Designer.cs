namespace LogWatcher.Frm
{
    partial class Frm_LoadModeSelector
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
            this.Btn_Ok = new System.Windows.Forms.Button();
            this.label3 = new System.Windows.Forms.Label();
            this.Lbl_FileSize = new System.Windows.Forms.Label();
            this.Btn_Cancel = new System.Windows.Forms.Button();
            this.Rb_Eof = new System.Windows.Forms.RadioButton();
            this.Rb_Filter = new System.Windows.Forms.RadioButton();
            this.Rb_Full = new System.Windows.Forms.RadioButton();
            this.SuspendLayout();
            // 
            // Btn_Ok
            // 
            this.Btn_Ok.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Right)));
            this.Btn_Ok.DialogResult = System.Windows.Forms.DialogResult.OK;
            this.Btn_Ok.Location = new System.Drawing.Point(270, 120);
            this.Btn_Ok.Name = "Btn_Ok";
            this.Btn_Ok.Size = new System.Drawing.Size(75, 23);
            this.Btn_Ok.TabIndex = 0;
            this.Btn_Ok.Text = "OK";
            this.Btn_Ok.UseVisualStyleBackColor = true;
            this.Btn_Ok.Click += new System.EventHandler(this.Btn_Ok_Click);
            this.Btn_Ok.KeyPress += new System.Windows.Forms.KeyPressEventHandler(this.Frm_LoadModeSelector_KeyPress);
            // 
            // label3
            // 
            this.label3.Location = new System.Drawing.Point(3, 9);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(381, 14);
            this.label3.TabIndex = 6;
            this.label3.Text = "This file is big so you can open it with different mode. Select your mode";
            // 
            // Lbl_FileSize
            // 
            this.Lbl_FileSize.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
            this.Lbl_FileSize.AutoSize = true;
            this.Lbl_FileSize.Location = new System.Drawing.Point(2, 125);
            this.Lbl_FileSize.Name = "Lbl_FileSize";
            this.Lbl_FileSize.Size = new System.Drawing.Size(55, 13);
            this.Lbl_FileSize.TabIndex = 5;
            this.Lbl_FileSize.Text = "File Size : ";
            // 
            // Btn_Cancel
            // 
            this.Btn_Cancel.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Right)));
            this.Btn_Cancel.DialogResult = System.Windows.Forms.DialogResult.Cancel;
            this.Btn_Cancel.Location = new System.Drawing.Point(189, 120);
            this.Btn_Cancel.Name = "Btn_Cancel";
            this.Btn_Cancel.Size = new System.Drawing.Size(75, 23);
            this.Btn_Cancel.TabIndex = 4;
            this.Btn_Cancel.Text = "Cancel";
            this.Btn_Cancel.UseVisualStyleBackColor = true;
            this.Btn_Cancel.Click += new System.EventHandler(this.Btn_Cancel_Click);
            // 
            // Rb_Eof
            // 
            this.Rb_Eof.AutoSize = true;
            this.Rb_Eof.Checked = true;
            this.Rb_Eof.Location = new System.Drawing.Point(12, 38);
            this.Rb_Eof.Name = "Rb_Eof";
            this.Rb_Eof.Size = new System.Drawing.Size(155, 17);
            this.Rb_Eof.TabIndex = 1;
            this.Rb_Eof.TabStop = true;
            this.Rb_Eof.Text = "1 - Load Only the end of file";
            this.Rb_Eof.UseVisualStyleBackColor = true;
            // 
            // Rb_Filter
            // 
            this.Rb_Filter.AutoSize = true;
            this.Rb_Filter.Location = new System.Drawing.Point(11, 61);
            this.Rb_Filter.Name = "Rb_Filter";
            this.Rb_Filter.Size = new System.Drawing.Size(203, 17);
            this.Rb_Filter.TabIndex = 2;
            this.Rb_Filter.Text = "2 - Load Only rows matching with filter";
            this.Rb_Filter.UseVisualStyleBackColor = true;
            // 
            // Rb_Full
            // 
            this.Rb_Full.AutoSize = true;
            this.Rb_Full.Location = new System.Drawing.Point(12, 84);
            this.Rb_Full.Name = "Rb_Full";
            this.Rb_Full.Size = new System.Drawing.Size(134, 17);
            this.Rb_Full.TabIndex = 3;
            this.Rb_Full.Text = "3 - Normal : load full file";
            this.Rb_Full.UseVisualStyleBackColor = true;
            // 
            // Frm_LoadModeSelector
            // 
            this.AcceptButton = this.Btn_Ok;
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(349, 149);
            this.Controls.Add(this.Rb_Full);
            this.Controls.Add(this.Rb_Filter);
            this.Controls.Add(this.Rb_Eof);
            this.Controls.Add(this.Btn_Cancel);
            this.Controls.Add(this.Lbl_FileSize);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.Btn_Ok);
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "Frm_LoadModeSelector";
            this.ShowInTaskbar = false;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterParent;
            this.Text = "Load Mode Selector";
            this.KeyPress += new System.Windows.Forms.KeyPressEventHandler(this.Frm_LoadModeSelector_KeyPress);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button Btn_Ok;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label Lbl_FileSize;
        private System.Windows.Forms.Button Btn_Cancel;
        private System.Windows.Forms.RadioButton Rb_Eof;
        private System.Windows.Forms.RadioButton Rb_Filter;
        private System.Windows.Forms.RadioButton Rb_Full;
    }
}