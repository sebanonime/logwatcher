using System;
using System.Collections.Generic;
using System.Text;
using System.Drawing;
using System.Xml.Serialization;
using System.Text.RegularExpressions;

namespace LogWatcher.Common
{
    [Serializable]
    public class Highlighting
    {
        #region Fields
        private Regex _regex;
        private bool? _isRegex, _caseSensitive;
        private string _text;
        private RegexOptions _option;
        #endregion

        #region Properties

        public int Order { get; set; }

        public string Text
        {
            get { return _text; }
            set
            {
                _text = value;
                SetRegexp();
            }
        }

        [XmlIgnoreAttribute]
        public Color ForeColor { get; set; }

        [XmlIgnoreAttribute]
        public Color BackColor { get; set; }

        public int ForeColorArgb
        {
            get { return ForeColor.ToArgb(); }
            set { ForeColor = Color.FromArgb(value); }
        }

        public int BackColorArgb
        {
            get { return BackColor.ToArgb(); }
            set { BackColor = Color.FromArgb(value); }
        }

        public bool Bold { get; set; }
        public bool HightPriority { get; set; }

        public bool CaseSensitive 
        {
            get { return _caseSensitive.HasValue ? _caseSensitive.Value : false; }
            set 
            {
                _caseSensitive = value;
                SetRegexp();
            }
        }

        public bool IsRegex 
        {
            get { return _isRegex.HasValue ? _isRegex.Value : false; }
            set
            {
                _isRegex = value;
                SetRegexp();
            }
        }

        #endregion

        #region Constructor

        public Highlighting()
        { 

        }

        public Highlighting(int order, string text, Color foreColor, Color backColor, bool caseSensitive, bool hightPriority, bool bold, bool isRegex)
        {
            Order = order;
            Text = text;
            ForeColor = foreColor;
            BackColor = backColor;
            CaseSensitive = caseSensitive;
            HightPriority = hightPriority;
            Bold = bold;
            IsRegex = isRegex;
            if (IsRegex)
            {
                RegexOptions option = !caseSensitive ? RegexOptions.IgnoreCase : RegexOptions.None;
                _regex = new Regex(text, RegexOptions.Compiled | option);
            }
        }

        public Highlighting(int order, string text, Color foreColor, Color backColor, bool caseSensitive, bool bold, bool isRegex)
            : this(order, text, foreColor, backColor, caseSensitive, false, bold, isRegex)
        { }

        public Highlighting(int order, string text, Color foreColor, Color backColor)
            : this(order, text, foreColor, backColor, false, false, false, false)
        {}


        #endregion

        private void SetRegexp()
        {
            _option = RegexOptions.None;
            if (_caseSensitive.HasValue)
            {
                _option = !_caseSensitive.Value ? RegexOptions.IgnoreCase : RegexOptions.None;
            }

            if (!string.IsNullOrEmpty(Text) && _isRegex.HasValue && _isRegex.Value)
            {
                _regex = new Regex(Text, RegexOptions.Compiled | _option);

            }
        }

        public bool TestHighlighting(string message)
        {
            if (string.IsNullOrEmpty(Text) || string.IsNullOrEmpty(message))
                return false;

            if (IsRegex && _regex != null)
            {
                try
                {
                    return _regex.IsMatch(message); 
                }
                catch
                {
                    return false;
                }
            }

            string mess = CaseSensitive ? message : message.ToUpper();
            string messHighlight = CaseSensitive ? Text : Text.ToUpper();

            return mess.IndexOf(messHighlight, 0) != -1;
        }

        #region ICloneable Members

        public Highlighting Clone()
        {
            return new Highlighting(Order, Text, ForeColor, BackColor, CaseSensitive, HightPriority, Bold, IsRegex);
        }

        #endregion
    }
}
