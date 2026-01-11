# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Network Canvas Architect is an Electron + React application for designing Network Canvas interview protocols. It includes a git submodule (`network-canvas/`) which was previously used for interview preview functionality (currently disabled pending modernization).

## Development Commands

```bash
# Install dependencies
pnpm install

# Development
pnpm run dev                        # Start electron-vite dev server with HMR

# Build
pnpm run build                      # Build production bundle
pnpm run preview                    # Preview production build

# Testing (Vitest)
pnpm test                           # Run tests once
pnpm test:watch                     # Watch mode
pnpm test:coverage                  # Run with coverage
pnpm test:update-snapshots          # Update snapshots

# Linting
pnpm run lint                       # Run both JS and SCSS linting
pnpm run lint:js                    # ESLint only
pnpm run sass-lint                  # Stylelint only

# Distribution
pnpm run dist:mac                   # macOS build (x64 + arm64)
pnpm run dist:linux                 # Linux build
pnpm run dist:win                   # Windows build
```

## Architecture

### Build System

electron-vite with custom configuration:
- **electron.vite.config.js** - Main, preload, and renderer configuration
- Main process files are copied (not bundled) due to CommonJS usage
- Renderer uses Vite with React plugin

### State Management

Redux with ducks pattern (`src/ducks/`):
- **store.js** - Redux store with redux-persist, thunk middleware
- **modules/root.js** - Root reducer combining all slices
- **modules/protocol/** - Protocol state (stages, codebook, assets) with timeline middleware for undo/redo
- **modules/session.js** - Current editing session state
- **modules/ui/** - UI state (screens, dialogs)

Protocol actions are prefixed with `PROTOCOL/` and tracked by the timeline middleware for undo/redo support.

### Selectors

Reselect-based selectors in `src/selectors/`:
- **protocol.js** - Current protocol data
- **codebook/** - Node/edge types, variables
- **indexes.js** - Derived indexes for fast lookups
- **usage.js** - Track where variables/types are used

### Import Aliases

Configured in `electron.vite.config.js` and `vitest.config.js`:
- `@app` → `src/`
- `@components` → `src/components/`
- `@modules` → `src/ducks/modules/`
- `@selectors` → `src/selectors/`
- `@hooks` → `src/hooks/`
- `@utils` → `src/utils/`

### Key Directories

- **src/components/sections/** - Stage editor section components (prompts, forms, panels per interview stage type)
- **src/components/StageEditor/** - Stage editing UI
- **src/components/Form/** - Redux-form field components
- **src/components/Codebook/** - Codebook (types/variables) management UI
- **src/utils/netcanvasFile/** - `.netcanvas` file format handling (read/write protocols)
- **src/utils/electronBridge.js** - Secure IPC bridge abstraction for renderer process
- **src/behaviours/** - Higher-order components for zoom, validation, windowing

### Protocol Structure

A protocol contains:
- `stages[]` - Interview stages configuration
- `codebook` - Node types, edge types, ego, and their variables
- `assetManifest` - Media assets (images, audio, video, external data)

### Electron Integration

Security hardened with context isolation:
- **public/electron-starter.js** - Electron main process entry
- **public/preload/appPreload.js** - Secure IPC bridge (contextBridge)
- **public/components/ipcHandlers.js** - Main process IPC handlers
- **src/utils/electronBridge.js** - Renderer-side abstraction for IPC

All Node.js operations happen in the main process via IPC. The renderer has no direct Node.js access.

## Testing

Vitest with Enzyme. Test files use `.test.js` suffix and are co-located with source files in `__tests__/` directories.

Test setup: `config/vitest/setup.js`
Mock files: `src/__mocks__/`

Snapshot testing is used for component rendering. Update snapshots with:
```bash
pnpm test:update-snapshots
```

## Code Style

- ESLint with Airbnb config
- Stylelint for SCSS
- Prettier for formatting (via VSCode)
- React 16 with class components and hooks
- Redux-form for form state

## Prerequisites

- Node.js 22.x (LTS)
- pnpm 9.x

## Security

This application uses Electron's recommended security model:
- `nodeIntegration: false`
- `contextIsolation: true`
- Preload scripts with contextBridge for IPC
- All file system operations via main process
