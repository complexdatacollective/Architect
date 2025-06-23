import { registerFileHandlers } from './fileHandlers'
import { registerDialogHandlers } from './dialogHandlers'
import { registerAppHandlers } from './appHandlers'
import { registerProtocolHandlers } from './protocolHandlers'
import { registerCSVHandlers } from './csvHandlers'
import { registerLegacyHandlers } from './legacyHandlers'

// Register all IPC handlers
export function registerAllIPCHandlers() {
  registerFileHandlers()
  registerDialogHandlers()
  registerAppHandlers()
  registerProtocolHandlers()
  registerCSVHandlers()
  registerLegacyHandlers()
  
  console.log('All IPC handlers registered successfully')
}