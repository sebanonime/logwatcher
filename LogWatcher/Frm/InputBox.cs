using System;
using System.Drawing;
using System.Collections;
using System.ComponentModel;
using System.Windows.Forms;

namespace System
{
	/// <summary>
	/// Description résumée de InputBox.
	/// </summary>
    public class InputBox : Form
	{
    private System.Windows.Forms.TextBox Txt_InputValue;
    private System.Windows.Forms.Button button1;
    private System.Windows.Forms.Label label1;
		/// <summary>
		/// Variable nécessaire au concepteur.
		/// </summary>
		private System.ComponentModel.Container components = null;

    public bool ok_valid=false;
    private System.Windows.Forms.Button button2;
    public String valeur = "";


    public InputBox()
		{
			InitializeComponent();
		}

		/// <summary>
		/// Nettoyage des ressources utilisées.
		/// </summary>
		protected override void Dispose( bool disposing )
		{
			if( disposing )
			{
				if(components != null)
				{
					components.Dispose();
				}
			}
			base.Dispose( disposing );
		}

		#region Code généré par le Concepteur Windows Form
		/// <summary>
		/// Méthode requise pour la prise en charge du concepteur - ne modifiez pas
		/// le contenu de cette méthode avec l'éditeur de code.
		/// </summary>
		private void InitializeComponent()
		{
            this.Txt_InputValue = new System.Windows.Forms.TextBox();
            this.button1 = new System.Windows.Forms.Button();
            this.label1 = new System.Windows.Forms.Label();
            this.button2 = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // Txt_InputValue
            // 
            this.Txt_InputValue.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left)
                        | System.Windows.Forms.AnchorStyles.Right)));
            this.Txt_InputValue.Font = new System.Drawing.Font("Microsoft Sans Serif", 9.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.Txt_InputValue.Location = new System.Drawing.Point(12, 44);
            this.Txt_InputValue.Name = "Txt_InputValue";
            this.Txt_InputValue.Size = new System.Drawing.Size(410, 22);
            this.Txt_InputValue.TabIndex = 0;
            this.Txt_InputValue.KeyDown += new System.Windows.Forms.KeyEventHandler(this.textBox1_KeyDown);
            // 
            // button1
            // 
            this.button1.Font = new System.Drawing.Font("Microsoft Sans Serif", 9.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.button1.Location = new System.Drawing.Point(277, 72);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(70, 27);
            this.button1.TabIndex = 1;
            this.button1.Text = "OK";
            this.button1.Click += new System.EventHandler(this.button1_Click);
            // 
            // label1
            // 
            this.label1.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left)
                        | System.Windows.Forms.AnchorStyles.Right)));
            this.label1.Font = new System.Drawing.Font("Microsoft Sans Serif", 9.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label1.Location = new System.Drawing.Point(12, 9);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(410, 32);
            this.label1.TabIndex = 2;
            this.label1.Text = "Entrez une valeur :";
            // 
            // button2
            // 
            this.button2.Font = new System.Drawing.Font("Microsoft Sans Serif", 9.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.button2.Location = new System.Drawing.Point(352, 72);
            this.button2.Name = "button2";
            this.button2.Size = new System.Drawing.Size(70, 27);
            this.button2.TabIndex = 3;
            this.button2.Text = "Cancel";
            this.button2.Click += new System.EventHandler(this.button2_Click);
            // 
            // InputBox
            // 
            this.AutoScaleBaseSize = new System.Drawing.Size(5, 13);
            this.ClientSize = new System.Drawing.Size(428, 106);
            this.Controls.Add(this.button2);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.button1);
            this.Controls.Add(this.Txt_InputValue);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "InputBox";
            this.ShowIcon = false;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "InputBox";
            this.Activated += new System.EventHandler(this.InputBox_Activated);
            this.Load += new System.EventHandler(this.InputBox_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

    }
		#endregion

    private void button1_Click(object sender, System.EventArgs e)
    {
      if (Txt_InputValue.Text.ToString()!="")
      {
        ok_valid=true;
        valeur=Txt_InputValue.Text.ToString();
      }
      else
      {
        ok_valid=false;
        valeur=null;
      }
      this.Close();
    }

    private void button2_Click(object sender, System.EventArgs e)
    {
      ok_valid=false;
      valeur=null;
      this.Close();
    }

    private void InputBox_Activated(object sender, System.EventArgs e)
    {
      Txt_InputValue.Focus();
    }

    public bool IsOK()
    {
      return ok_valid;
    }

    public String ShowDialog(String quest)
    {
        return ShowDialog(quest, "");
    }

    public String ShowDialog(String quest, string defaultValue)
    {
      ok_valid=false;
      valeur=null;
      Txt_InputValue.Text = defaultValue;
      if ((quest==null) || (quest=="")) quest="Entrez une valeur :";
      label1.Text = quest;
      this.ShowDialog();
      return valeur;
    }

    private void textBox1_KeyDown(object sender, System.Windows.Forms.KeyEventArgs e)
    {
      if (e.KeyCode==Keys.Enter) button1_Click(null,null);
    }

    private void InputBox_Load(object sender, EventArgs e)
    {

    }
	}
}
