using System;
using System.Collections.Generic;
using System.Text;
using System.IO;

namespace LogWatcher.Common
{
    public class FileNameManager
    {
        public static string GetRealFileName(string fileName)
        {
            if (fileName.Contains("%DATE("))// it's dynamic filename
            {
                string[] tmp = fileName.Split(new[] { "%DATE(" }, StringSplitOptions.RemoveEmptyEntries);
                if (tmp.Length > 1)
                {
                    tmp = tmp[1].Split(')');
                    if (tmp.Length > 0)
                    {
                        string dateFormat = tmp[0].Trim();
                        return fileName.Replace(string.Format("%DATE({0})", dateFormat), DateTime.Now.ToString(dateFormat));
                    }
                }
            }
            else if (fileName.Contains("*"))
            {
                DirectoryInfo dir = new DirectoryInfo(fileName.Replace(Path.GetFileName(fileName), ""));
                FileInfo[] files = dir.GetFiles(Path.GetFileName(fileName));
                SortedDictionary<DateTime, string> sortedFile = new SortedDictionary<DateTime, string>();
                foreach (FileInfo item in files)
                {
                    if (!sortedFile.ContainsKey(item.LastWriteTime))
                    {
                        sortedFile.Add(item.LastWriteTime, item.FullName);
                    }
                }

                string[] sortedStringList = new string[sortedFile.Count];
                sortedFile.Values.CopyTo(sortedStringList, 0);

                return sortedStringList[sortedStringList.Length - 1];
            }

            return fileName;
        }
    }
}
