using System;
using System.Xml.Serialization;
#if NETFRAMEWORK
using System.Drawing;
#endif

namespace LogWatcher.Common
{
    [Serializable]
    public class SimpleFont
    {
        public string Name { get; set; }
        public float Size { get; set; }

#if NETFRAMEWORK
        public FontStyle Style { get; set; }
#else
        // FontStyle stored as int for cross-platform serialization compatibility
        public int Style { get; set; }
#endif

        public SimpleFont()
        {
        }

#if NETFRAMEWORK
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
                return new Font(Name, Size, Style);
            }
            catch
            {
                return new Font("Courier New", 9, FontStyle.Regular);
            }
        }
#else
        public SimpleFont(string name, float size, int style = 0)
        {
            Name = name;
            Size = size;
            Style = style;
        }
#endif
    }
}
