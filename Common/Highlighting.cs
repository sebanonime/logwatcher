using System;
using System.Text.RegularExpressions;
using System.Xml.Serialization;
#if NETFRAMEWORK
using System.Drawing;
#endif

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
        private int _foreColorArgb;
        private int _backColorArgb;
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

#if NETFRAMEWORK
        [XmlIgnoreAttribute]
        public Color ForeColor
        {
            get { return Color.FromArgb(_foreColorArgb); }
            set { _foreColorArgb = value.ToArgb(); }
        }

        [XmlIgnoreAttribute]
        public Color BackColor
        {
            get { return Color.FromArgb(_backColorArgb); }
            set { _backColorArgb = value.ToArgb(); }
        }
#endif

        public int ForeColorArgb
        {
            get { return _foreColorArgb; }
            set { _foreColorArgb = value; }
        }

        public int BackColorArgb
        {
            get { return _backColorArgb; }
            set { _backColorArgb = value; }
        }

        public int DarkForeColorArgb { get; set; }
        public int DarkBackColorArgb { get; set; }
        public int LightForeColorArgb { get; set; }
        public int LightBackColorArgb { get; set; }

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

#if NETFRAMEWORK
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
        { }
#endif

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

        public Highlighting Clone()
        {
            var clone = new Highlighting();
            clone.Order = Order;
            clone.Text = Text;
            clone.ForeColorArgb = ForeColorArgb;
            clone.BackColorArgb = BackColorArgb;
            clone.DarkForeColorArgb = DarkForeColorArgb;
            clone.DarkBackColorArgb = DarkBackColorArgb;
            clone.LightForeColorArgb = LightForeColorArgb;
            clone.LightBackColorArgb = LightBackColorArgb;
            clone.CaseSensitive = CaseSensitive;
            clone.HightPriority = HightPriority;
            clone.Bold = Bold;
            clone.IsRegex = IsRegex;
            return clone;
        }

        public int ResolveForeColorArgb(bool darkTheme)
        {
            var themedValue = darkTheme ? DarkForeColorArgb : LightForeColorArgb;
            return themedValue != 0 ? themedValue : ForeColorArgb;
        }

        public int ResolveBackColorArgb(bool darkTheme)
        {
            var themedValue = darkTheme ? DarkBackColorArgb : LightBackColorArgb;
            return themedValue != 0 ? themedValue : BackColorArgb;
        }
    }
}
