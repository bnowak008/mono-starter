import { readFileSync } from 'fs'
import { extname, relative, resolve } from 'path'
import { parse as parseJson } from 'json5'
import type { FileMetadata, ProjectType } from './types'

export const analyzeFile = (filePath: string, rootDir: string): FileMetadata => {
  const relativePath = relative(rootDir, filePath)
  const ext = extname(filePath)
  
  // Determine workspace and type
  const workspace = relativePath.startsWith('apps/') 
    ? 'apps' 
    : relativePath.startsWith('packages/') 
      ? 'packages' 
      : null

  const type = determineFileType(filePath, workspace)
  
  return {
    path: relativePath,
    type,
    workspace,
    lastModified: new Date().toISOString(),
    ...extractFileDependencies(filePath, ext)
  }
}

const determineFileType = (path: string, workspace: string | null): ProjectType => {
  if (path.includes('package.json')) return 'config'
  if (path.includes('tsconfig.json')) return 'config'
  if (workspace === 'apps') return 'app'
  if (workspace === 'packages') return 'package'
  return 'unknown'
}

const extractFileDependencies = (path: string, ext: string) => {
  if (ext === '.json') {
    try {
      const content = readFileSync(path, 'utf-8')
      const json = parseJson(content)
      return {
        dependencies: [
          ...Object.keys(json.dependencies || {}),
          ...Object.keys(json.devDependencies || {}),
          ...Object.keys(json.peerDependencies || {})
        ]
      }
    } catch (e) {
      return {}
    }
  }
  return {}
} 