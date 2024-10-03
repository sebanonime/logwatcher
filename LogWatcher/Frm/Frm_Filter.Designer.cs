namespace LogWatcher.Frm
{
    partial class Frm_Filter
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
            this.Cb_MatchCase = new System.Windows.Forms.CheckBox();
            this.Cb_WholeWord = new System.Windows.Forms.CheckBox();
            this.Btn_Ok = new System.Windows.Forms.Button();
            this.Btn_Cancel = new System.Windows.Forms.Button();
            this.label1 = new System.Windows.Forms.Label();
            this.Txt_ManualFilter = new System.Windows.Forms.TextBox();
            this.chkLstBox_StoredFilter = new System.Windows.Forms.CheckedListBox();
            this.label2 = new System.Windows.Forms.Label();
            this.Btn_ProfileName = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // Cb_MatchCase
            // 
            this.Cb_MatchCase.AutoSize = true;
            this.Cb_MatchCase.Checked = true;
            this.Cb_MatchCase.CheckState = System.Windows.Forms.CheckState.Checked;
            this.Cb_MatchCase.Location = new System.Drawing.Point(14, 47);
            this.Cb_MatchCase.Name = "Cb_MatchCase";
            this.Cb_MatchCase.Size = new System.Drawing.Size(83, 17);
            this.Cb_MatchCase.TabIndex = 2;
            this.Cb_MatchCase.Text = "Match Case";
            this.Cb_MatchCase.UseVisualStyleBackColor = true;
            // 
            // Cb_WholeWord
            // 
            this.Cb_WholeWord.AutoSize = true;
            this.Cb_WholeWord.Location = new System.Drawing.Point(14, 70);
            this.Cb_WholeWord.Name = "Cb_WholeWord";
            this.Cb_WholeWord.Size = new System.Drawing.Size(119, 17);
            this.Cb_WholeWord.TabIndex = 3;
            this.Cb_WholeWord.Text = "Match Whole Word";
            this.Cb_WholeWord.UseVisualStyleBackColor = true;
            // 
            // Btn_Ok
            // 
            this.Btn_Ok.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.Btn_Ok.CausesValidation = false;
            this.Btn_Ok.DialogResult = System.Windows.Forms.DialogResult.OK;
            this.Btn_Ok.Location = new System.Drawing.Point(363, 236);
            this.Btn_Ok.Name = "Btn_Ok";
            this.Btn_Ok.Size = new System.Drawing.Size(52, 23);
            this.Btn_Ok.TabIndex = 5;
            this.Btn_Ok.Text = "OK";
            this.Btn_Ok.UseVisualStyleBackColor = true;
            this.Btn_Ok.Click += new System.EventHandler(this.Btn_Ok_Click);
            // 
            // Btn_Cancel
            // 
            this.Btn_Cancel.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.Btn_Cancel.DialogResult = System.Windows.Forms.DialogResult.Cancel;
            this.Btn_Cancel.Location = new System.Drawing.Point(426, 236);
            this.Btn_Cancel.Name = "Btn_Cancel";
            this.Btn_Cancel.Size = new System.Drawing.Size(52, 23);
            this.Btn_Cancel.TabIndex = 6;
            this.Btn_Cancel.Text = "Cancel";
            this.Btn_Cancel.UseVisualStyleBackColor = true;
            this.Btn_Cancel.Click += new System.EventHandler(this.Btn_Cancel_Click);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(3, 5);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(38, 13);
            this.label1.TabIndex = 7;
            this.label1.Text = "Filter : ";
            // 
            // Txt_ManualFilter
            // 
            this.Txt_ManualFilter.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left)
                        | System.Windows.Forms.AnchorStyles.Right)));
            this.Txt_ManualFilter.AutoCompleteMode = System.Windows.Forms.AutoCompleteMode.Suggest;
            this.Txt_ManualFilter.Location = new System.Drawing.Point(6, 21);
            this.Txt_ManualFilter.Name = "Txt_ManualFilter";
            this.Txt_ManualFilter.Size = new System.Drawing.Size(456, 20);
            this.Txt_ManualFilter.TabIndex = 8;
            // 
            // chkLstBox_StoredFilter
            // 
            this.chkLstBox_StoredFilter.CheckOnClick = true;
            this.chkLstBox_StoredFilter.FormattingEnabled = true;
            this.chkLstBox_StoredFilter.Location = new System.Drawing.Point(6, 125);
            this.chkLstBox_StoredFilter.Name = "chkLstBox_StoredFilter";
            this.chkLstBox_StoredFilter.Size = new System.Drawing.Size(472, 109);
            this.chkLstBox_StoredFilter.TabIndex = 9;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(6, 102);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(149, 13);
            this.label2.TabIndex = 10;
            this.label2.Text = "Stored filter of current Profile : ";
            // 
            // Btn_ProfileName
            // 
            this.Btn_ProfileName.AutoSize = true;
            this.Btn_ProfileName.FlatStyle = System.Windows.Forms.FlatStyle.Popup;
            this.Btn_ProfileName.Location = new System.Drawing.Point(151, 97);
            this.Btn_ProfileName.Name = "Btn_ProfileName";
            this.Btn_ProfileName.Size = new System.Drawing.Size(80, 23);
            this.Btn_ProfileName.TabIndex = 12;
            this.Btn_ProfileName.Text = "[ProfileName]";
            this.Btn_ProfileName.UseVisualStyleBackColor = true;
            this.Btn_ProfileName.Click += new System.EventHandler(this.Btn_ProfileName_Click);
            // 
            // Frm_Filter
            // 
            this.AcceptButton = this.Btn_Ok;
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.CancelButton = this.Btn_Cancel;
            this.ClientSize = new System.Drawing.Size(487, 265);
            this.Controls.Add(this.Btn_ProfileName);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.chkLstBox_StoredFilter);
            this.Controls.Add(this.Txt_ManualFilter);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.Btn_Cancel);
            this.Controls.Add(this.Btn_Ok);
            this.Controls.Add(this.Cb_WholeWord);
            this.Controls.Add(this.Cb_MatchCase);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.Fixed3D;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "Frm_Filter";
            this.ShowIcon = false;
            this.ShowInTaskbar = false;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterParent;
            this.Text = "Filter";
            this.Shown += new System.EventHandler(this.Frm_Filter_Shown);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.CheckBox Cb_MatchCase;
        private System.Windows.Forms.CheckBox Cb_WholeWord;
        private System.Windows.Forms.Button Btn_Ok;
        private System.Windows.Forms.Button Btn_Cancel;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TextBox Txt_ManualFilter;
        private System.Windows.Forms.CheckedListBox chkLstBox_StoredFilter;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Button Btn_ProfileName;
    }
}