using System;
using System.Collections.Generic;
using System.Text;
using System.Xml.Serialization;

namespace LogWatcher.Common
{

    [Serializable]
    public class Profile
    {
        public string Name { get; set; }
        public string LoadingParam { get; set; }
        public string Encoding { get; set; }
        [XmlIgnoreAttribute]
        public bool Shared{ get; set; }
        public List<Highlighting> DicoHighLighting { get; set; }
        public List<HiddenLine> DicoHiddenLog { get; set; }
        public List<StoredFilter> DicoStoredFilter { get; set; }

        public Profile() : this("")
        {}

        public Profile(string profileName)
        {
            Name = profileName;
            DicoHighLighting = new List<Highlighting>();
            DicoHiddenLog = new List<HiddenLine>();
            DicoStoredFilter = new List<StoredFilter>();
            LoadingParam = "";
        }

        public Profile(string name, string loadingParam, List<Highlighting> dicoHighLighting, List<HiddenLine> dicoHiddenLog, List<StoredFilter> dicoStoredFilter, string encoding, bool shared)
        {
            Name = name;
            LoadingParam = loadingParam;
            Encoding = encoding;
            DicoHighLighting = dicoHighLighting;
            DicoHiddenLog = dicoHiddenLog;
            DicoStoredFilter = dicoStoredFilter;
            Shared = shared;
        }

        #region ICloneable Membres

        public Profile Clone()
        {
            List<HiddenLine> hiddenLines = new List<HiddenLine>();
            foreach (HiddenLine item in DicoHiddenLog)
            {
                //new HiddenLine(line.Text, line.IsActif, line.IsRegex, line.CaseSensitive)
                hiddenLines.Add(item.Clone());
            }

            List<Highlighting> Highlightings = new List<Highlighting>();
            foreach (Highlighting item in DicoHighLighting)
            {
                Highlightings.Add(item.Clone());
            }

            List<StoredFilter> storedFilters = new List<StoredFilter>();
            foreach (StoredFilter item in DicoStoredFilter)
            {
                storedFilters.Add(item.Clone());
            }

            return new Profile(Name, LoadingParam, Highlightings, hiddenLines, storedFilters, Encoding, Shared);
        }

        #endregion

        #region Equals
        public bool Equals(Profile obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            return Equals(obj.Name, Name);
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != typeof(Profile)) return false;
            return Equals((Profile)obj);
        }

        public override int GetHashCode()
        {
            return (Name != null ? Name.GetHashCode() : 0);
        } 
        #endregion

        public override string ToString()
        {
            return Name;
        }

        public static int Compare(Profile first, Profile second)
        {
            return string.Compare(first.Name, second.Name);
        }
    }
}
