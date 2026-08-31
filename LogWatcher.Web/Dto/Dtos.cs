using System.Text.Json.Serialization;

namespace LogWatcher.Web.Dto
{
    public class LineDto
    {
        [JsonPropertyName("lineNumber")]
        public int LineNumber { get; set; }
        
        [JsonPropertyName("text")]
        public string Text { get; set; }
    }

    public class FileStatsDto
    {
        [JsonPropertyName("totalLines")]
        public int TotalLines { get; set; }
        
        [JsonPropertyName("sizeBytes")]
        public long SizeBytes { get; set; }
        
        [JsonPropertyName("isIndexed")]
        public bool IsIndexed { get; set; }
        
        [JsonPropertyName("serverId")]
        public string ServerId { get; set; }
        
        [JsonPropertyName("filePath")]
        public string FilePath { get; set; }

        [JsonPropertyName("viewVersion")]
        public int ViewVersion { get; set; }
    }

    public class FilterOptionsDto
    {
        public string Pattern { get; set; }
        public bool IsRegex { get; set; }
        public bool CaseSensitive { get; set; }
        public List<HiddenLinePattern> HiddenLines { get; set; } = new();
    }

    public class HiddenLinePattern
    {
        public string Text { get; set; }
        public bool IsRegex { get; set; }
        public bool CaseSensitive { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class OpenLogOptionsDto
    {
        public string ProfileName { get; set; }
        public string Encoding { get; set; } = "UTF-8";
        public bool LoadFromEnd { get; set; } = true;
        public int InitialLines { get; set; } = 500;
    }

    public class ContextLinesDto
    {
        public int TargetLineNumber { get; set; }
        public LineDto[] Lines { get; set; } = Array.Empty<LineDto>();
    }

    public class RemoteFileInfoDto
    {
        public string Path { get; set; }
        public long SizeBytes { get; set; }
        public DateTimeOffset LastModified { get; set; }
        public bool IsDirectory { get; set; }
        public string ServerId { get; set; }
        /// <summary>For directories: true if the directory contains at least one child entry.</summary>
        public bool HasChildren { get; set; }
        /// <summary>True if this is a .zip/.7z archive file that can be browsed into.</summary>
        public bool IsArchive { get; set; }
        /// <summary>Human-readable name of the server/source this item comes from.</summary>
        public string SourceName { get; set; }
    }

    /// <summary>One content-search match within a file (1-based original line number).</summary>
    public class MatchedLineDto
    {
        public int LineNumber { get; set; }
        public string Text { get; set; }
    }

    /// <summary>Content-search result for a single file, returned by both SMB scanning and Agent delegation.</summary>
    public class FileSearchMatchDto
    {
        public string Path { get; set; }
        public DateTimeOffset LastModified { get; set; }
        public List<MatchedLineDto> Lines { get; set; } = new();
        /// <summary>True if this file had more matches than the per-file cap allows.</summary>
        public bool Truncated { get; set; }
    }
}
