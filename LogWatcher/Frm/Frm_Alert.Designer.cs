namespace LogWatcher.Frm
{
    partial class Frm_Alert
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
            this.Lbl_Title = new System.Windows.Forms.Label();
            this.Btn_Ok = new System.Windows.Forms.Button();
            this.Txt_Message = new System.Windows.Forms.TextBox();
            this.SuspendLayout();
            // 
            // Lbl_Title
            // 
            this.Lbl_Title.AutoSize = true;
            this.Lbl_Title.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, ((System.Drawing.FontStyle)((System.Drawing.FontStyle.Bold | System.Drawing.FontStyle.Underline))), System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.Lbl_Title.Location = new System.Drawing.Point(3, 3);
            this.Lbl_Title.Name = "Lbl_Title";
            this.Lbl_Title.Size = new System.Drawing.Size(32, 13);
            this.Lbl_Title.TabIndex = 0;
            this.Lbl_Title.Text = "Title";
            // 
            // Btn_Ok
            // 
            this.Btn_Ok.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(255)))), ((int)(((byte)(255)))), ((int)(((byte)(192)))));
            this.Btn_Ok.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.Btn_Ok.Location = new System.Drawing.Point(90, 91);
            this.Btn_Ok.Name = "Btn_Ok";
            this.Btn_Ok.Size = new System.Drawing.Size(75, 23);
            this.Btn_Ok.TabIndex = 2;
            this.Btn_Ok.Text = "OK";
            this.Btn_Ok.UseVisualStyleBackColor = false;
            this.Btn_Ok.Click += new System.EventHandler(this.Btn_Ok_Click);
            // 
            // Txt_Message
            // 
            this.Txt_Message.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(255)))), ((int)(((byte)(255)))), ((int)(((byte)(192)))));
            this.Txt_Message.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.Txt_Message.Location = new System.Drawing.Point(5, 19);
            this.Txt_Message.Multiline = true;
            this.Txt_Message.Name = "Txt_Message";
            this.Txt_Message.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.Txt_Message.Size = new System.Drawing.Size(246, 66);
            this.Txt_Message.TabIndex = 3;
            // 
            // Frm_Alert
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(255)))), ((int)(((byte)(255)))), ((int)(((byte)(192)))));
            this.ClientSize = new System.Drawing.Size(256, 120);
            this.Controls.Add(this.Txt_Message);
            this.Controls.Add(this.Btn_Ok);
            this.Controls.Add(this.Lbl_Title);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.Name = "Frm_Alert";
            this.ShowInTaskbar = false;
            this.Text = "Frm_Alert";
            this.TopMost = true;
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label Lbl_Title;
        private System.Windows.Forms.Button Btn_Ok;
        private System.Windows.Forms.TextBox Txt_Message;
    }
}