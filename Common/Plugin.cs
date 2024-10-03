using System;
using System.Collections.Generic;
using System.Text;

namespace LogWatcher.Common
{
    public class Plugin
    {
        public Plugin()
        {
        }

        public Plugin(string text, string typeName)
        {
            Text = text;
            TypeName = typeName;
        }

        public string Text { get; set; }
        public string TypeName { get; set; }

        public Plugin Clone()
        {
            return new Plugin(Text, TypeName);
        }
    }
}
