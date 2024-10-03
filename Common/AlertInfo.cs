using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace LogWatcher.Common
{
    [Serializable]
    public class AlertInfo
    {
        public string SearchText { get; set; }
        public string Message { get; set; }
        public bool IsActif { get; set; }

        public AlertInfo()
        {
        }

        public AlertInfo(string searchText, string message)
            : this(searchText, message, true)
        {
        }

        /// <summary>
        ///           Initialise une nouvelle instance de la classe <see cref="T:System.Object" />.
        /// </summary>
        public AlertInfo(string searchText, string message, bool isActif)
        {
            SearchText = searchText;
            Message = message;
            IsActif = isActif;
        }

        //public AlertInfo(string searchText, string message, bool isActif)
        //{
        //    SearchText = searchText;
        //    Message = message;
        //    IsActif = isActif;
        //}

        public override string ToString()
        {
            return SearchText + " - " + Message;
        }

        public AlertInfo Clone()
        {
            return new AlertInfo(SearchText, Message, IsActif);
        }

        public static int Compare(AlertInfo first, AlertInfo second)
        {
            return string.Compare(first.SearchText, second.SearchText);
        }
    }
}
