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
  viewVersion: number
}

export interface ContextLinesDto {
  targetLineNumber: number
  lines: LineDto[]
}

export interface FilterOptionsDto {
  pattern: string
  isRegex: boolean
  caseSensitive: boolean
  hiddenLines?: HiddenLinePattern[]
}

export interface HiddenLinePattern {
  text: string
  isRegex: boolean
  caseSensitive: boolean
  isActive: boolean
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
  type: 'smb' | 'agent'
  host?: string
  agentId?: string
  username?: string
  agentOnline?: boolean
}

export interface KnownAgentDto {
  agentId: string
  hostname: string
  lastSeen: string
  online: boolean
}

export interface PathStatusDto {
  accessible?: boolean
  online?: boolean
}

export interface FixValueDto {
  enum: string
  description: string
}

export interface FixFieldDto {
  number: number
  name: string
  type: string
  values: FixValueDto[]
}

export interface RootFolderDto {
  name: string
  servers: ServerDto[]
  environmentColor?: string
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
  serverId: string
  hasChildren?: boolean
  sourceName?: string
}

export interface HighlightingRule {
  order: number
  text: string
  foreColorArgb: number
  backColorArgb: number
  darkForeColorArgb?: number
  darkBackColorArgb?: number
  lightForeColorArgb?: number
  lightBackColorArgb?: number
  bold: boolean
  hightPriority: boolean
  caseSensitive: boolean
  isRegex: boolean
}

export interface HiddenLineDto {
  isActif: boolean
  text: string
  caseSensitive: boolean
  isRegex: boolean
}

export interface StoredFilterDto {
  name: string
  filter: string
  isRegex: boolean
  caseSensitive: boolean
}

export interface ProfileDto {
  name: string
  loadingParam: string
  encoding: string
  shared: boolean
  dicoHighLighting: HighlightingRule[]
  dicoHiddenLog: HiddenLineDto[]
  dicoStoredFilter: StoredFilterDto[]
}

export interface PreferencesPayloadDto {
  defaultHighlights: HighlightingRule[]
  profiles: ProfileDto[]
}

export interface LogTab {
  sessionId: string
  serverId: string
  filePath: string
  displayName: string
  serverName: string
  totalLines: number
  sizeBytes: number
  isIndexed: boolean
  indexedBytes?: number
  indexTotalBytes?: number
  newLinesCount: number
  tailMode: boolean
  isFiltered: boolean
  filterPattern?: string
  filterIsRegex?: boolean
  filterCaseSensitive?: boolean
  viewVersion?: number
  contextStartLine?: number
  contextTotalLines?: number
  activeProfileName?: string
  activeStoredFilterName?: string
  errorMessage?: string
  environmentColor?: string
  isFiltering?: boolean
}

export type UserFontFamily = 'Cascadia Code' | 'Consolas' | 'Segoe UI' | 'Bahnschrift'
