using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml.Serialization;
using System.Configuration;

namespace LogWatcher.Common
{
    public class HiddenLine : IEquatable<HiddenLine>
    {
        private int _maxLineSize;
        private Regex _regex;
        private bool? _isRegex, _caseSensitive;
        private RegexOptions _option;
        private string _text;

        public bool IsActif { get; set; }

        public string Text
        {
            get { return _text; }
            set
            {
                _text = value;
                SetRegexp();
            }
        }

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

        //[XmlIgnoreAttribute]
        //private Regex _regex { get; set; }

        public HiddenLine() : this(null, true, false, false)
        {
            
        }

        public HiddenLine(string text) : this(text, true, false, false)
        {
        }

        public HiddenLine(string text, bool isActif, bool isRegex, bool caseSensitive)
        {
            Text = text;
            IsActif = isActif;
            IsRegex = isRegex;
            CaseSensitive = caseSensitive;

            string maxLineSizeStr = ConfigurationManager.AppSettings["MaxLineSize"];
            if (!int.TryParse(maxLineSizeStr, out _maxLineSize))
            {
                _maxLineSize = 20000;
            }

            if (IsRegex)
            {
                RegexOptions option = !caseSensitive ? RegexOptions.IgnoreCase : RegexOptions.None;
                _regex = new Regex(text, RegexOptions.Compiled | option);
            }
        }


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

        public bool IsVisible(string msg)
        {
            if (IsActif && msg.Length < _maxLineSize)
            {
                if (IsRegex && _regex != null)
                {
                    return !_regex.IsMatch(msg);
                }
                else
                {
                    return !msg.Contains(Text);
                }
            }
            return true;
        }

        #region Object ovveride

        public HiddenLine Clone()
        {
            return new HiddenLine(Text, IsActif, IsRegex, CaseSensitive);
        }

        public bool Equals(HiddenLine other)
        {
            return (other != null) &&
                   this.CaseSensitive == other.CaseSensitive &&
                   this.IsActif == other.IsActif &&
                   this.IsRegex == other.IsRegex &&
                   this.Text == other.Text;
        }

        public override string ToString()
        {
            return Text;
        }

        #endregion

        public static int Compare(HiddenLine first, HiddenLine second)
        {
            return string.Compare(first.Text, second.Text);
        }
    }
}
