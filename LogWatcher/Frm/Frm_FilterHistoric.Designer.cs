namespace LogWatcher.Frm
{
    partial class Frm_FilterHistoric
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
            this.Lst_FilterHistoric = new System.Windows.Forms.ListBox();
            this.filterHistoricBindingSource = new System.Windows.Forms.BindingSource(this.components);
            this.Txt_SelectedFilter = new System.Windows.Forms.TextBox();
            this.Btn_ApplyFilter = new System.Windows.Forms.Button();
            this.Btn_Search = new System.Windows.Forms.Button();
            ((System.ComponentModel.ISupportInitialize)(this.filterHistoricBindingSource)).BeginInit();
            this.SuspendLayout();
            // 
            // Lst_FilterHistoric
            // 
            this.Lst_FilterHistoric.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom)
                        | System.Windows.Forms.AnchorStyles.Left)
                        | System.Windows.Forms.AnchorStyles.Right)));
            this.Lst_FilterHistoric.DataSource = this.filterHistoricBindingSource;
            this.Lst_FilterHistoric.DisplayMember = "Critere";
            this.Lst_FilterHistoric.FormattingEnabled = true;
            this.Lst_FilterHistoric.Location = new System.Drawing.Point(2, 57);
            this.Lst_FilterHistoric.Name = "Lst_FilterHistoric";
            this.Lst_FilterHistoric.Size = new System.Drawing.Size(773, 95);
            this.Lst_FilterHistoric.TabIndex = 0;
            this.Lst_FilterHistoric.DoubleClick += new System.EventHandler(this.Lst_FilterHistoric_DoubleClick);
            this.Lst_FilterHistoric.Click += new System.EventHandler(this.Lst_FilterHistoric_Click);
            // 
            // filterHistoricBindingSource
            // 
            this.filterHistoricBindingSource.DataSource = typeof(LogWatcher.Common.FilterHistoric);
            // 
            // Txt_SelectedFilter
            // 
            this.Txt_SelectedFilter.AcceptsReturn = true;
            this.Txt_SelectedFilter.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left)
                        | System.Windows.Forms.AnchorStyles.Right)));
            this.Txt_SelectedFilter.Location = new System.Drawing.Point(2, 12);
            this.Txt_SelectedFilter.Multiline = true;
            this.Txt_SelectedFilter.Name = "Txt_SelectedFilter";
            this.Txt_SelectedFilter.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.Txt_SelectedFilter.Size = new System.Drawing.Size(692, 42);
            this.Txt_SelectedFilter.TabIndex = 1;
            this.Txt_SelectedFilter.KeyPress += new System.Windows.Forms.KeyPressEventHandler(this.Txt_SelectedFilter_KeyPress);
            // 
            // Btn_ApplyFilter
            // 
            this.Btn_ApplyFilter.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.Btn_ApplyFilter.Location = new System.Drawing.Point(700, 11);
            this.Btn_ApplyFilter.Name = "Btn_ApplyFilter";
            this.Btn_ApplyFilter.Size = new System.Drawing.Size(75, 21);
            this.Btn_ApplyFilter.TabIndex = 2;
            this.Btn_ApplyFilter.Text = "Filter";
            this.Btn_ApplyFilter.UseVisualStyleBackColor = true;
            this.Btn_ApplyFilter.Click += new System.EventHandler(this.Btn_ApplyFilter_Click);
            // 
            // Btn_Search
            // 
            this.Btn_Search.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.Btn_Search.Location = new System.Drawing.Point(700, 33);
            this.Btn_Search.Name = "Btn_Search";
            this.Btn_Search.Size = new System.Drawing.Size(75, 21);
            this.Btn_Search.TabIndex = 3;
            this.Btn_Search.Text = "Search";
            this.Btn_Search.UseVisualStyleBackColor = true;
            this.Btn_Search.Click += new System.EventHandler(this.Btn_Search_Click);
            // 
            // Frm_FilterHistoric
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(777, 157);
            this.Controls.Add(this.Btn_Search);
            this.Controls.Add(this.Btn_ApplyFilter);
            this.Controls.Add(this.Txt_SelectedFilter);
            this.Controls.Add(this.Lst_FilterHistoric);
            this.MinimumSize = new System.Drawing.Size(8, 185);
            this.Name = "Frm_FilterHistoric";
            this.TabText = "Filter Historic";
            this.Text = "Filter Historic";
            this.Shown += new System.EventHandler(this.Frm_FilterHistoric_Shown);
            ((System.ComponentModel.ISupportInitialize)(this.filterHistoricBindingSource)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.ListBox Lst_FilterHistoric;
        private System.Windows.Forms.TextBox Txt_SelectedFilter;
        private System.Windows.Forms.Button Btn_ApplyFilter;
        private System.Windows.Forms.BindingSource filterHistoricBindingSource;
        private System.Windows.Forms.Button Btn_Search;
    }
}