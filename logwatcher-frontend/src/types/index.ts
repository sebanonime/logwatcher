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
  serverId: string
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
  newLinesCount: number
  tailMode: boolean
  isFiltered: boolean
  activeProfileName?: string
  activeStoredFilterName?: string
  errorMessage?: string
}

export type UserFontFamily = 'Cascadia Code' | 'Consolas' | 'Segoe UI' | 'Bahnschrift'
