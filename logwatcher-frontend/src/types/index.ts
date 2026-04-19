// ─── Domain types shared across the app ───────────────────────────────────

export interface LineDto {
  lineNumber: number
  text: string
}

export interface FileStatsDto {
  totalLines: number
  sizeBytes: number
  isIndexed: boolean
  serverId: string
  filePath: string
}

export interface FilterOptionsDto {
  pattern: string
  isRegex: boolean
  caseSensitive: boolean
}

export interface OpenLogOptionsDto {
  profileName?: string
  encoding?: string
  loadFromEnd?: boolean
  initialLines?: number
}

export interface ServerDto {
  id: string
  name: string
  type: 'local' | 'smb' | 'agent'
  host?: string
  agentId?: string
  username?: string
  agentOnline?: boolean
}

export interface RootFolderDto {
  name: string
  servers: ServerDto[]
}

export interface PerimeterDto {
  id: string
  name: string
  rootFolders: RootFolderDto[]
}

export interface RemoteFileInfoDto {
  path: string
  sizeBytes: number
  lastModified: string
  isDirectory: boolean
}

// ─── Highlighting rule (matches Common/Highlighting.cs) ────────────────────

export interface HighlightingRule {
  order: number
  text: string
  foreColorArgb: number    // ARGB int from .NET Color
  backColorArgb: number
  bold: boolean
  hightPriority: boolean
  caseSensitive: boolean
  isRegex: boolean
}

// ─── Tab state ─────────────────────────────────────────────────────────────

export interface LogTab {
  sessionId: string
  serverId: string
  filePath: string
  displayName: string
  serverName: string
  totalLines: number
  sizeBytes: number
  isIndexed: boolean
  newLinesCount: number   // lines added while user is scrolled up
  tailMode: boolean
  isFiltered: boolean
}


// ─── Highlighting rule (matches Common/Highlighting.cs) ────────────────────

export interface HighlightingRule {
  order: number
  text: string
  foreColorArgb: number    // ARGB int from .NET Color
  backColorArgb: number
  bold: boolean
  hightPriority: boolean
  caseSensitive: boolean
  isRegex: boolean
}

// ─── Tab state ─────────────────────────────────────────────────────────────

export interface LogTab {
  sessionId: string
  serverId: string
  filePath: string
  displayName: string
  serverName: string
  totalLines: number
  sizeBytes: number
  isIndexed: boolean
  newLinesCount: number   // lines added while user is scrolled up
  tailMode: boolean
  isFiltered: boolean
}
