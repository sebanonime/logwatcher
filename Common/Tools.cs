using System;
using System.Collections.Generic;
using System.Configuration;
using System.Text;
using System.IO;
using System.Xml;
using System.Security.AccessControl;

namespace LogWatcher.Common
{
    public class Tools
    {
        public static string GetAutoFormatedText(string text)
        {
            string resu = GetFormatedTextForXml(text);
            if(resu==text)
            {
                resu = GetFormatedTextWithAutoSeparator(text);
            }

            return resu;
        }

        public static string GetFormatedTextForXml(string text)
        {
            string resu;
            if (text.Contains("<")) //"<?xml"
            {
                try
                {
                    int xmlStart = text.IndexOf("<");
                    int xmlEnd = text.LastIndexOf(">") + 1;

                    string xml = text.Substring(xmlStart, xmlEnd - xmlStart);

                    string formatedXml;
                    if (TryIndentXMLString(xml, out formatedXml))
                    {
                        resu = text.Substring(0, xmlStart) + "\r\n";
                        resu += formatedXml;
                        resu += "\r\n" + text.Substring(xmlEnd, text.Length - xmlEnd);
                    }
                    else
                    {
                        resu = text;
                    }
                }
                catch
                {
                    resu = text;
                }
            }
            else
            {
                resu = text;
            }

            return resu;
        }

        public static string GetFormatedTextWithAutoSeparator(string text)
        {
            string formating_Separator = ConfigurationManager.AppSettings["Formating_Separator"];
            int formating_SeparatorNumber;
            if (int.TryParse(ConfigurationManager.AppSettings["Formating_SeparatorNumber"], out formating_SeparatorNumber))
            {
                string[] separator = formating_Separator.Split(new[] { "OR" }, StringSplitOptions.RemoveEmptyEntries);

                int numBestSeparator = 0;
                string bestSeparator = string.Empty;
                foreach (string s in separator)
                {
                    int numSeparator = text.Split(s.ToCharArray()).Length;
                    if (numSeparator >= formating_SeparatorNumber)
                    {
                        if (numSeparator > numBestSeparator)
                        {
                            numBestSeparator = numSeparator;
                            bestSeparator = s;
                        }
                    }
                }
                if (!string.IsNullOrEmpty(bestSeparator))
                    return ApplySeparator(text, bestSeparator);
            }

            return text;
        }

        public static string ApplySeparator(string text, string separator)
        {
            if (String.IsNullOrEmpty(separator))
            {
                return text;
            }

            return text.Replace(separator, separator + "\r\n");
        }

        public static bool TryIndentXMLString(string xml, out string formatedXml)
        {
            formatedXml = "";
            string outXml = string.Empty;
            MemoryStream ms = new MemoryStream();
            // Create a XMLTextWriter that will send its output to a memory stream (file)
            XmlTextWriter xtw = new XmlTextWriter(ms, Encoding.Unicode);
            XmlDocument doc = new XmlDocument();

            try
            {
                // Load the unformatted XML text string into an instance
                // of the XML Document Object Model (DOM)
                doc.LoadXml(xml);

                // Set the formatting property of the XML Text Writer to indented
                // the text writer is where the indenting will be performed
                xtw.Formatting = Formatting.Indented;

                // write dom xml to the xmltextwriter
                doc.WriteContentTo(xtw);
                // Flush the contents of the text writer
                // to the memory stream, which is simply a memory file
                xtw.Flush();

                // set to start of the memory stream (file)
                ms.Seek(0, SeekOrigin.Begin);
                // create a reader to read the contents of
                // the memory stream (file)
                StreamReader sr = new StreamReader(ms);
                formatedXml = sr.ReadToEnd();

                return true;
            }
            catch
            {
                return false;
            }
        }

        public static string DisplayFileSize(long fileSize)
        {
            string resu = fileSize + " Octet";
            if (fileSize > 1000000000)
            {
                resu = ((float)(fileSize / 1000000000.0)).ToString("0.##") + " Go";
            }
            else if(fileSize > 1000000)
            {
                resu = ((float)(fileSize / 1000000.0)).ToString("0.##") + " Mo";
            }
            else if(fileSize > 1000)
            {
                resu = ((float)(fileSize / 1000.0)).ToString("0.##") + " Ko";
            }

            return resu;
        }
    }
}
