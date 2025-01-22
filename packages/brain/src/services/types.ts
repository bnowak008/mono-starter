export type ProjectType = 'app' | 'package' | 'config' | 'unknown'

export type MonorepoContext = {
  rootDir: string
  workspaces: {
    apps: string[]
    packages: string[]
  }
  dependencies: Record<string, string>
}

export type FileMetadata = {
  path: string
  type: ProjectType
  workspace: string | null
  lastModified: string
  content?: string
  dependencies?: string[]
}

export type WatchEvent = 'add' | 'change' | 'delete'

export type FileChange = {
  event: WatchEvent
  metadata: FileMetadata
  timestamp: string
}

export type WatcherOptions = {
  ignored?: RegExp | string[]
  persistent?: boolean
} 