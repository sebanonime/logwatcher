namespace LogWatcher.Frm
{
    partial class Frm_ProfileSelector
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
            this.Lst_Profiles = new System.Windows.Forms.ListBox();
            this.profileBindingSource = new System.Windows.Forms.BindingSource(this.components);
            this.Btn_Ok = new System.Windows.Forms.Button();
            this.Btn_Cancel = new System.Windows.Forms.Button();
            ((System.ComponentModel.ISupportInitialize)(this.profileBindingSource)).BeginInit();
            this.SuspendLayout();
            // 
            // Lst_Profiles
            // 
            this.Lst_Profiles.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left)
                        | System.Windows.Forms.AnchorStyles.Right)));
            this.Lst_Profiles.DataSource = this.profileBindingSource;
            this.Lst_Profiles.DisplayMember = "Name";
            this.Lst_Profiles.FormattingEnabled = true;
            this.Lst_Profiles.Location = new System.Drawing.Point(5, 37);
            this.Lst_Profiles.Name = "Lst_Profiles";
            this.Lst_Profiles.Size = new System.Drawing.Size(283, 212);
            this.Lst_Profiles.TabIndex = 0;
            this.Lst_Profiles.MouseDoubleClick += new System.Windows.Forms.MouseEventHandler(this.Lst_Profiles_MouseDoubleClick);
            // 
            // profileBindingSource
            // 
            this.profileBindingSource.DataSource = typeof(LogWatcher.Common.Profile);
            // 
            // Btn_Ok
            // 
            this.Btn_Ok.Location = new System.Drawing.Point(132, 255);
            this.Btn_Ok.Name = "Btn_Ok";
            this.Btn_Ok.Size = new System.Drawing.Size(75, 23);
            this.Btn_Ok.TabIndex = 1;
            this.Btn_Ok.Text = "Ok";
            this.Btn_Ok.UseVisualStyleBackColor = true;
            this.Btn_Ok.Click += new System.EventHandler(this.Btn_Ok_Click);
            // 
            // Btn_Cancel
            // 
            this.Btn_Cancel.Location = new System.Drawing.Point(213, 255);
            this.Btn_Cancel.Name = "Btn_Cancel";
            this.Btn_Cancel.Size = new System.Drawing.Size(75, 23);
            this.Btn_Cancel.TabIndex = 2;
            this.Btn_Cancel.Text = "Cancel";
            this.Btn_Cancel.UseVisualStyleBackColor = true;
            this.Btn_Cancel.Click += new System.EventHandler(this.Btn_Cancel_Click);
            // 
            // Frm_ProfileSelector
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(292, 283);
            this.Controls.Add(this.Btn_Cancel);
            this.Controls.Add(this.Btn_Ok);
            this.Controls.Add(this.Lst_Profiles);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "Frm_ProfileSelector";
            this.ShowIcon = false;
            this.ShowInTaskbar = false;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterParent;
            this.Text = "Profile Selector";
            this.Shown += new System.EventHandler(this.Frm_ProfileSelector_Shown);
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.Frm_ProfileSelector_FormClosing);
            ((System.ComponentModel.ISupportInitialize)(this.profileBindingSource)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.ListBox Lst_Profiles;
        private System.Windows.Forms.Button Btn_Ok;
        private System.Windows.Forms.Button Btn_Cancel;
        private System.Windows.Forms.BindingSource profileBindingSource;
    }
}