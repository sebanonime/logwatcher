using System;
using System.Collections.Generic;
using System.Text;
using System.Drawing;

namespace LogWatcher.Common
{
    [Serializable]
    public class SimpleFont
    {
        public string Name { get; set; }
        public float Size { get; set; }
        public FontStyle Style { get; set; }

        public SimpleFont()
        {
            //Name = "";
        }

        public SimpleFont(string name, float size, FontStyle style)
        {
            Name = name;
            Size = size;
            Style = style;
        }

        public SimpleFont(Font font2Convert)
        {
            Name = font2Convert.Name;
            Size = font2Convert.Size;
            Style = font2Convert.Style;
        }

        public Font GetFont()
        {
            try
            {
                Font tmp = new Font(Name, Size, Style);
                return tmp;
            }
            catch
            {
                return new Font("Courier New", 9, FontStyle.Regular);
            }
        }
    }
}
