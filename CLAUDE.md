# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with electron-vite
- `npm run start` - Run built application in preview mode
- `npm run prebuild` - Build the application for production

### Version Management
- `npm run bump` - Bump version numbers using custom script

## Architecture Overview

### Application Structure
Network Canvas Architect is an Electron application for designing survey protocols for the Network Canvas suite. It uses a modern secure architecture with proper process isolation.

### Process Architecture
- **Main Process** (`src/main/`): Handles system operations, file I/O, and IPC
- **Renderer Process** (`src/renderer/`): React-based UI with no direct Node.js access
- **Preload Script** (`src/preload/`): Secure bridge between main and renderer

### Critical Security Pattern
The application enforces strict context isolation. ALL Node.js operations (file system, dialogs, platform detection) must go through the IPC bridge:
- **Never** import Node.js modules directly in renderer code
- **Always** use the API wrapper at `src/renderer/api/` 
- **All** file operations use `fileSystemAPI` from preload
- **All** dialogs use `dialogAPI` from preload

### IPC Bridge Architecture
- **Main Process Handlers**: `src/main/ipc/` - Contains organized handlers for different operation types
- **Preload APIs**: `src/preload/index.js` - Exposes secure APIs to renderer
- **Renderer API Wrapper**: `src/renderer/api/` - Provides fs-extra compatible interface

### Key Directories

#### `src/renderer/`
- `api/` - IPC bridge wrappers (CRITICAL: use these instead of Node.js modules)
- `components/` - React components organized by feature
- `ducks/` - Redux modules following ducks pattern
- `utils/` - Utility functions (use `@utils/` alias)
- `selectors/` - Redux selectors (use `@selectors/` alias)

#### `src/main/`
- `ipc/` - IPC handlers organized by domain (file, dialog, app, protocol, csv)
- `components/` - Main process utilities for window management, menus

### Protocol File Architecture
Network Canvas protocols (.netcanvas files) are zip archives containing:
- `protocol.json` - Main protocol configuration
- `assets/` - Directory with protocol assets (images, audio, data files)

Protocol operations use specialized handlers in `src/main/ipc/protocolHandlers.js` for secure import/export.

### Path Aliases (electron-vite)
- `@app` → `./src/renderer`
- `@components` → `./src/renderer/components` 
- `@selectors` → `./src/renderer/selectors`
- `@hooks` → `./src/renderer/hooks`
- `@modules` → `./src/renderer/modules`
- `@utils` → `./src/renderer/utils`

### State Management
Uses Redux with the "ducks" pattern where actions, reducers, and selectors are co-located by domain in `src/renderer/ducks/modules/`.

### Asset Management
Assets are imported into protocol working directories and managed through the asset manifest system. All asset operations must use the IPC bridge for security.

### Form Handling
Extensive use of redux-form for complex protocol configuration forms. Form validation is integrated with the protocol validation system.

### Migration Context
This codebase recently underwent a major security migration from Electron 9.4.4 to 36.3.2, transitioning from webpack to electron-vite, and implementing strict context isolation. The IPC bridge architecture is the result of this modernization effort.

## Important Patterns

### File Operations
```javascript
// ❌ Never do this in renderer:
import fs from 'fs-extra';

// ✅ Always do this:
import { fileSystem } from '@app/api';
const data = await fileSystem.readFile(path);
```

### Platform Detection
```javascript
// ❌ Never do this in renderer:
if (process.platform === 'darwin')

// ✅ Always do this:
import { isMacOS } from '@utils/platform';
if (isMacOS())
```

### Dialog Operations
```javascript
// ❌ Never do this in renderer:
import { remote } from 'electron';
remote.dialog.showOpenDialog();

// ✅ Always do this:
import { dialog } from '@app/api';
const result = await dialog.showOpenDialog(options);
```

### Error Handling
All IPC operations return promises and should use try/catch blocks. The API wrapper handles error propagation from the main process.