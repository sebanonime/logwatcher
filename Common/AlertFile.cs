using System.Xml.Serialization;

namespace LogWatcher.Common
{
    public class AlertFile
    {
        public string FilePath { get; set; }
        public bool IsActif { get; set; }
        /// <summary>
        /// tell if this alert is used only for background watcher or open file watcher
        /// </summary>
        [XmlIgnore]
        public bool OnlyForDisplayedFile { get; set; }

        /// <summary>
        /// Initialise une nouvelle instance de la classe <see cref="T:System.Object" />.
        /// </summary>
        public AlertFile()
        {
        }

        /// <summary>
        ///           Initialise une nouvelle instance de la classe <see cref="T:System.Object" />.
        /// </summary>
        public AlertFile(string filePath, bool actif)
        {
            FilePath = filePath;
            IsActif = actif;
        }

        /// <summary>
        ///           Initialise une nouvelle instance de la classe <see cref="T:System.Object" />.
        /// </summary>
        public AlertFile(string filePath)
        {
            FilePath = filePath;
            IsActif = true;
        }

        public bool Equals(AlertFile obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            return Equals(obj.FilePath, FilePath);
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != typeof (AlertFile)) return false;
            return Equals((AlertFile) obj);
        }

        public override int GetHashCode()
        {
            return (FilePath != null ? FilePath.GetHashCode() : 0);
        }

        public override string ToString()
        {
            return FilePath;
        }

        public AlertFile Clone()
        {
            return new AlertFile(FilePath, IsActif);
        }

        public static int Compare(AlertFile first, AlertFile second)
        {
            return string.Compare(first.FilePath, second.FilePath);
        }
    }
}
