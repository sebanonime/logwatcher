namespace LogWatcher.Frm
{
    partial class Frm_Search
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
            this.Txt_Search = new System.Windows.Forms.TextBox();
            this.Cb_MatchCase = new System.Windows.Forms.CheckBox();
            this.Cb_WholeWord = new System.Windows.Forms.CheckBox();
            this.Btn_Ok = new System.Windows.Forms.Button();
            this.Btn_Cancel = new System.Windows.Forms.Button();
            this.label1 = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // Txt_Search
            // 
            this.Txt_Search.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left)
                                                                           | System.Windows.Forms.AnchorStyles.Right)));
            this.Txt_Search.AutoCompleteMode = System.Windows.Forms.AutoCompleteMode.Suggest;
            this.Txt_Search.AutoCompleteSource = System.Windows.Forms.AutoCompleteSource.HistoryList;
            this.Txt_Search.Location = new System.Drawing.Point(5, 24);
            this.Txt_Search.Name = "Txt_Search";
            this.Txt_Search.Size = new System.Drawing.Size(256, 20);
            this.Txt_Search.TabIndex = 0;
            // 
            // Cb_MatchCase
            // 
            this.Cb_MatchCase.AutoSize = true;
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
            this.Btn_Ok.Location = new System.Drawing.Point(146, 95);
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
            this.Btn_Cancel.Location = new System.Drawing.Point(209, 95);
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
            this.label1.Size = new System.Drawing.Size(50, 13);
            this.label1.TabIndex = 7;
            this.label1.Text = "Search : ";
            // 
            // Frm_Search
            // 
            this.AcceptButton = this.Btn_Ok;
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.CancelButton = this.Btn_Cancel;
            this.ClientSize = new System.Drawing.Size(265, 123);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.Btn_Cancel);
            this.Controls.Add(this.Btn_Ok);
            this.Controls.Add(this.Cb_WholeWord);
            this.Controls.Add(this.Cb_MatchCase);
            this.Controls.Add(this.Txt_Search);
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "Frm_Search";
            this.ShowHint = WeifenLuo.WinFormsUI.Docking.DockState.Float;
            this.ShowIcon = false;
            this.ShowInTaskbar = false;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.TabText = "Filter";
            this.Text = "Search";
            this.Shown += new System.EventHandler(this.Frm_Search_Shown);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.TextBox Txt_Search;
        private System.Windows.Forms.CheckBox Cb_MatchCase;
        private System.Windows.Forms.CheckBox Cb_WholeWord;
        private System.Windows.Forms.Button Btn_Ok;
        private System.Windows.Forms.Button Btn_Cancel;
        private System.Windows.Forms.Label label1;
    }
}