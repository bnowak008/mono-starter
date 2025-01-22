import { select } from '@clack/prompts'
import { execSync } from 'child_process'
import { createFileWatcher } from '../services/fileWatcher'

async function main() {
  const mode = await select({
    message: 'Select development mode:',
    options: [
      { value: 'web', label: 'Web (Client + Server)' },
      { value: 'mobile', label: 'Mobile' },
      { value: 'full', label: 'Full Stack (Web + Mobile)' }
    ]
  })

  // Start the file watcher
  const watcher = await createFileWatcher(process.cwd())
  
  // Start the selected development mode
  console.log('\n🚀 Starting development environment...\n')
  
  try {
    execSync(`bun run ${mode}`, { stdio: 'inherit' })
  } catch (error) {
    console.error('Failed to start development environment:', error)
    watcher.close()
    process.exit(1)
  }
}

main().catch(console.error) 