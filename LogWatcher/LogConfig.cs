using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using System.Xml.Serialization;
using System.Drawing;
using SerializerTools;
using System.Diagnostics;
using System.Runtime.Serialization.Formatters.Binary;
using System.Windows.Forms;
using LogWatcher.Common;
using System.Xml.XPath;
using System.Xml;
using System.Security.AccessControl;

namespace LogWatcher
{
    [Serializable]
    public class LogConfig
    {
        #region Fields

        private static string profileFolderLocal;
        private static readonly string CONFIG_FILE = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "LogWatcherConfig.xml");

        private static XmlCustomSerializer configSerializer = new XmlCustomSerializer(typeof(LogConfig));
        private static XmlCustomSerializer profileSerializer = new XmlCustomSerializer(typeof(Profile));
        private static LogConfig _singleton;
        private static string _configFileVersion;
        private static object sync = new object();
        
        #endregion

        #region Properties

        public DoubleClickActions DoubleClickAction { get; set; }

        [XmlIgnoreAttribute]
        public static LogConfig Singleton
        {
            //[DebuggerStepThrough]
            get
            {
                lock (sync)
                {
                    if (_singleton == null)
                    {
                        if (File.Exists(CONFIG_FILE))
                        {
                            LoadConfigFile();
                        }
                        else
                            _singleton = new LogConfig();
                    }

                    return _singleton;
                }
            }
        }

        public List<Highlighting> DicoHighlighting { get; set; }
        public List<AlertInfo> DicoAlert { get; set; }
        public List<AlertFile> DicoAlertFile { get; set; }
        public List<string> DicoLoadedLog { get; set; }
        public LogBrowserConfig LogBrowser { get; set; }
        [XmlIgnoreAttribute]
        public Dictionary<string, Profile> DicoProfile { get; set; }
        public Dictionary<string, Plugin> DicoPlugin { get; set; }
        public List<string> DicoSearchedKeyword { get; set; }


        public bool IsSingleInstance { get; set; }
        public bool AlwaysOnTop { get; set; }
        public bool WrapLine { get; set; }
        public bool SaveLogsOnClose { get; set; }
        public bool ShowLogBrowser { get; set; }
        public bool ShowFilterHistoric { get; set; }
        public bool ShowSelectedView { get; set; }
        public string LogBrowserState { get; set; }
        public string SelectedViewState { get; set; }
        public string FilterHistoricState { get; set; }
        public bool LoadOnlyEof{ get; set; }
        public bool ShowWarnBanner { get; set; }

        public string ProfileFolderShared { get; set; }

        public int ShowOnlyLogBrowserFileNumDays { get; set; }

        public int EofSizeToLoad { get; set; }
        public int MaxSizeToPrompt { get; set; }
        
        public int ContextRowNbr { get; set; }
        public int LocationX { get; set; }
        public int LocationY { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public bool FullScreen { get; set; }
        public string Version { get; set; }

        public SimpleFont DefaultFont { get; set; }
        public string DefaultEncoding { get; set; }

        //[XmlIgnoreAttribute]
        //public Encoding DefaultEncoding
        //{
        //    get
        //    {
        //        return MapEncoding(DefaultStringEncoding);
        //    }
        //}

        #endregion

        #region Constructor

        public LogConfig()
        {
            DicoHighlighting = new List<Highlighting>();
            DicoAlert = new List<AlertInfo>();
            DicoAlertFile = new List<AlertFile>();
            DicoLoadedLog = new List<string>();
            DicoProfile = new Dictionary<string, Profile>();
            DicoPlugin = new Dictionary<string, Plugin>();
            DicoSearchedKeyword = new List<string>();

            LogBrowser = new LogBrowserConfig();

            DefaultFont = new SimpleFont();
            ShowWarnBanner = true;
            IsSingleInstance = true;
            Version = "1";
            profileFolderLocal = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Profile");
            if (!Directory.Exists(profileFolderLocal))
            {
                Directory.CreateDirectory(profileFolderLocal);
            }
        }

        #endregion

        #region Methods

        public void Save()
        {
            DicoHighlighting.Sort(delegate(Highlighting h1, Highlighting h2) { return h1.Order.CompareTo(h2.Order); });

            foreach (Profile profileTmp in DicoProfile.Values)
            {
                profileTmp.DicoHighLighting.Sort(delegate(Highlighting h1, Highlighting h2) { return h1.Order.CompareTo(h2.Order); });
                if (!profileTmp.Shared)
                {
                    SaveProfile(profileTmp);
                }
            }

            try
            {
                configSerializer = new XmlCustomSerializer(typeof(LogConfig));
                File.WriteAllText(CONFIG_FILE, configSerializer.Serialize(this), Encoding.Default);
            }
            catch (UnauthorizedAccessException)
            {
            }
            catch
            {
                MessageBox.Show("Saving configuration error occur", "ERROR", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void SaveProfile(Profile profile)
        {
            try
            {
                string fileName = Path.Combine(profileFolderLocal, string.Format("{0}.lwp", CleanProfileName(profile.Name)));
                string objserialized = profileSerializer.Serialize(profile);
                File.WriteAllText(fileName, objserialized, Encoding.Default);
            }
            catch (UnauthorizedAccessException)
            {
            }
            catch (Exception ex)
            {
                MessageBox.Show("Saving profile error occur : " + ex.Message, "ERROR", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        public static string CleanProfileName(string name)
        {
            return name.Replace("/", "").Replace("\\", "").Replace("\"", "").Replace(">", "").Replace("<", "").Replace("*", "").Replace("?", "").Replace("|", "").Replace("*", "");
        }

        private static void LoadAllProfile()
        {
            // Load all shared folder
            if (!string.IsNullOrEmpty(_singleton.ProfileFolderShared))
            {
                LoadProfiles(_singleton.ProfileFolderShared, true);
            }

            // Load all local folder
            LoadProfiles(profileFolderLocal, false);
        }

        private static void LoadProfiles(string folderPath, bool shared)
        {
            DirectoryInfo directory = new DirectoryInfo(folderPath);
            foreach (FileInfo file in directory.GetFiles("*.lwp"))
            {
                Profile profile = profileSerializer.Deserialize<Profile>(File.ReadAllText(file.FullName));
                if (shared)
                {
                    profile.Shared = true;
                }

                _singleton.DicoProfile[profile.Name] = profile;
            }
        }

        private static void LoadConfigFile()
        {
            try
            {
                Dictionary<string, List<string>> allProfileName = CorrectConfigFile();

                _singleton = configSerializer.Deserialize<LogConfig>(File.ReadAllText(CONFIG_FILE));

                LoadAllProfile();

                foreach (KeyValuePair<string, List<string>> pair in allProfileName)
                {
                    Profile prf;
                    if (_singleton.DicoProfile.TryGetValue(pair.Key, out prf))
                    {
                        foreach (string s in pair.Value)
                        {
                            prf.DicoHiddenLog.Add(new HiddenLine(s, true, false, false));
                        }
                        
                    }
                }
            }
            catch(Exception ex)
            {
                try
                {
                    #if DEBUG
                    MessageBox.Show(ex.Message);
                    #endif
                    _singleton = XmlCustomSerializer_old1.Deserialize<LogConfig>(File.ReadAllText(CONFIG_FILE));
                }
                catch
                {
                    _singleton = new LogConfig();
                    MessageBox.Show("Loading configuration error occur", "ERROR", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
            
        }

        private static Dictionary<string, List<string>> CorrectConfigFile()
        {
            try
            {
                XmlDocument doc = new XmlDocument();
                doc.LoadXml(File.ReadAllText(CONFIG_FILE));
                XPathNavigator xPathNav = doc.CreateNavigator();

                #region Get Config file version

                string expConfigVersion = "/LogWatcher.LogConfig/Version";
                XPathNodeIterator iterVersion = xPathNav.Select(expConfigVersion);
                if (iterVersion != null)
                {
                    iterVersion.MoveNext();
                    if (iterVersion.Current != null && iterVersion.Current.NodeType != XPathNodeType.Root)
                    {
                        _configFileVersion = iterVersion.Current.InnerXml;

                        if (_configFileVersion.Length > 5)
                            _configFileVersion = null;
                    }
                }

                #endregion

                if (string.IsNullOrEmpty(_configFileVersion))
                {
                    #region Correct Config File

                    string expProfileName = "//LogWatcher.Common.Profile/Name";

                    XPathNodeIterator iter = xPathNav.Select(expProfileName);

                    Dictionary<string, List<string>> allProfileName = new Dictionary<string, List<string>>();
                    if (iter != null)
                    {
                        while (iter.MoveNext())
                        {
                            string profileName = iter.Current.InnerXml;

                            List<string> allHiddenLine = new List<string>();
                            string expProfileData =
                                String.Format("//LogWatcher.Common.Profile[Name='{0}']/DicoHiddenLog/descendant::*",
                                              profileName);
                            XPathNodeIterator iterHidden = xPathNav.Select(expProfileData);

                            if (iterHidden != null)
                            {
                                while (iterHidden.MoveNext())
                                {
                                    if (!string.IsNullOrEmpty(iterHidden.Current.InnerXml))
                                        allHiddenLine.Add(iterHidden.Current.InnerXml);
                                }
                            }


                            allProfileName.Add(profileName, allHiddenLine);
                        }
                    }

                    XmlNodeList nodeToDelete = doc.SelectNodes("//DicoHiddenLog");
                    foreach (XmlNode nodeTmp in nodeToDelete)
                    {
                        nodeTmp.ParentNode.RemoveChild(nodeTmp);
                    }
                    //nodeToDelete.Item.ParentNode.RemoveChild(nodeToDelete);
                    doc.Save(CONFIG_FILE);

                    return allProfileName;

                    #endregion
                }
            }
            catch
            {
#if DEBUG
                throw;
#endif
            }

            return new Dictionary<string, List<string>>();
        }

        public Encoding MapEncoding(string encode)
        {
            switch (encode.ToUpper())
            {
                case "DEFAULT":
                    return Encoding.Default;
                case "ASCII":
                    return Encoding.ASCII;
                case "BIGENDIANUNICODE":
                    return Encoding.BigEndianUnicode;
                case "UNICODE":
                    return Encoding.Unicode;
                case "UTF32":
                    return Encoding.UTF32;
                case "UTF7":
                    return Encoding.UTF7;
                case "UTF8":
                    return Encoding.UTF8;
                default:
                    return Encoding.Default;

            }
        }


        #endregion
    }
}


