
using System.Drawing;

namespace LogWatcher.Common
{
    public class LogRow
    {
        public LogRow(string text, Highlighting highlighting)
        {
            Text = text;
            this.BackGroundColor = ColorTranslator.ToHtml(highlighting.BackColor);
            this.ForegroundColor = ColorTranslator.ToHtml(highlighting.ForeColor);
            //this.BackGroundColor = ColorTranslator.ToHtml(Color.Black);
            //this.ForegroundColor = ColorTranslator.ToHtml(Color.White);
        }

        public string Text {  get; set; }

        public string BackGroundColor { get; set; }

        public string ForegroundColor { get; set; }
    }
}