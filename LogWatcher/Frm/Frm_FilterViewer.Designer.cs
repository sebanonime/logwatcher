namespace LogWatcher.Frm
{
    partial class Frm_FilterViewer
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
            this.Txt_Filter = new System.Windows.Forms.TextBox();
            this.Btn_Apply = new System.Windows.Forms.Button();
            this.Btn_Cancel = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // Txt_Filter
            // 
            this.Txt_Filter.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom)
                        | System.Windows.Forms.AnchorStyles.Left)
                        | System.Windows.Forms.AnchorStyles.Right)));
            this.Txt_Filter.Font = new System.Drawing.Font("Microsoft Sans Serif", 9.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.Txt_Filter.Location = new System.Drawing.Point(5, 7);
            this.Txt_Filter.Multiline = true;
            this.Txt_Filter.Name = "Txt_Filter";
            this.Txt_Filter.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.Txt_Filter.Size = new System.Drawing.Size(548, 190);
            this.Txt_Filter.TabIndex = 0;
            this.Txt_Filter.KeyPress += new System.Windows.Forms.KeyPressEventHandler(this.Txt_Filter_KeyPress);
            // 
            // Btn_Apply
            // 
            this.Btn_Apply.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Right)));
            this.Btn_Apply.Location = new System.Drawing.Point(478, 203);
            this.Btn_Apply.Name = "Btn_Apply";
            this.Btn_Apply.Size = new System.Drawing.Size(75, 23);
            this.Btn_Apply.TabIndex = 1;
            this.Btn_Apply.Text = "Apply";
            this.Btn_Apply.UseVisualStyleBackColor = true;
            this.Btn_Apply.Click += new System.EventHandler(this.Btn_Apply_Click);
            // 
            // Btn_Cancel
            // 
            this.Btn_Cancel.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Right)));
            this.Btn_Cancel.Location = new System.Drawing.Point(397, 203);
            this.Btn_Cancel.Name = "Btn_Cancel";
            this.Btn_Cancel.Size = new System.Drawing.Size(75, 23);
            this.Btn_Cancel.TabIndex = 2;
            this.Btn_Cancel.Text = "Cancel";
            this.Btn_Cancel.UseVisualStyleBackColor = true;
            this.Btn_Cancel.Click += new System.EventHandler(this.Btn_Cancel_Click);
            // 
            // Frm_FilterViewer
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(558, 230);
            this.Controls.Add(this.Btn_Cancel);
            this.Controls.Add(this.Btn_Apply);
            this.Controls.Add(this.Txt_Filter);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.SizableToolWindow;
            this.Name = "Frm_FilterViewer";
            this.Text = "Filter Viewer";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.TextBox Txt_Filter;
        private System.Windows.Forms.Button Btn_Apply;
        private System.Windows.Forms.Button Btn_Cancel;
    }
}