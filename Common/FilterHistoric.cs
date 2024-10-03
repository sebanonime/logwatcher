using System;

namespace LogWatcher.Common
{
    public class FilterHistoric
    {
        public string Critere { get; set; }
        public DateTime CritereDate { get; set; }

        public FilterHistoric()
        {
        }

        /// <summary>
        /// Initialise une nouvelle instance de la classe <see cref="T:System.Object" />.
        /// </summary>
        public FilterHistoric(string critere)
        {
            Critere = critere;
            CritereDate = DateTime.Now;
        }

        /// <summary>
        ///           Initialise une nouvelle instance de la classe <see cref="T:System.Object" />.
        /// </summary>
        public FilterHistoric(string critere, DateTime critereDate)
        {
            Critere = critere;
            CritereDate = critereDate;
        }
    }
}
