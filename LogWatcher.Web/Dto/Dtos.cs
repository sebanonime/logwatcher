namespace LogWatcher.Web.Dto
{
    public class LineDto
    {
        public int LineNumber { get; set; }
        public string Text { get; set; }
    }

    public class FileStatsDto
    {
        public int TotalLines { get; set; }
        public long SizeBytes { get; set; }
        public bool IsIndexed { get; set; }
        public string ServerId { get; set; }
        public string FilePath { get; set; }
    }

    public class FilterOptionsDto
    {
        public string Pattern { get; set; }
        public bool IsRegex { get; set; }
        public bool CaseSensitive { get; set; }
    }

    public class OpenLogOptionsDto
    {
        public string ProfileName { get; set; }
        public string Encoding { get; set; } = "UTF-8";
        public bool LoadFromEnd { get; set; } = true;
        public int InitialLines { get; set; } = 500;
    }

    public class RemoteFileInfoDto
    {
        public string Path { get; set; }
        public long SizeBytes { get; set; }
        public DateTimeOffset LastModified { get; set; }
        public bool IsDirectory { get; set; }
    }
}
