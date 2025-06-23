# Renderer API

This directory contains renderer-side wrappers for Node.js modules and Electron APIs. These wrappers provide the same interface as the original modules but use the IPC bridge exposed through the preload script.

## Purpose

In Electron applications with context isolation enabled, renderer processes cannot directly access Node.js modules. This API layer provides a clean interface for renderer code to perform file system operations, show dialogs, and other system interactions through secure IPC channels.

## Available APIs

### fileSystem
Wrapper for fs-extra operations:
```javascript
import { fileSystem } from '@/renderer/api';

// Read a file
const content = await fileSystem.readFile('/path/to/file.txt', 'utf8');

// Write JSON
await fileSystem.writeJson('/path/to/data.json', { foo: 'bar' });

// Create directory
await fileSystem.mkdirp('/path/to/new/directory');
```

### dialog
Wrapper for Electron dialog operations:
```javascript
import { dialog } from '@/renderer/api';

// Show open dialog
const result = await dialog.showOpenDialog({
  filters: [{ name: 'JSON', extensions: ['json'] }]
});

// Show confirmation
const confirmed = await dialog.confirm('Are you sure?', 'This action cannot be undone.');
```

### path
Wrapper for path operations:
```javascript
import { path } from '@/renderer/api';

// Join paths
const fullPath = await path.join('/users', 'documents', 'file.txt');

// Get basename
const filename = await path.basename('/path/to/file.txt'); // 'file.txt'
```

### app
Wrapper for Electron app operations:
```javascript
import { app } from '@/renderer/api';

// Get user data path
const userDataPath = await app.getUserDataPath();

// Get app version
const version = await app.getVersion();

// Check platform
if (app.isMac()) {
  // macOS specific code
}
```

### shell
Wrapper for shell operations:
```javascript
import { shell } from '@/renderer/api';

// Open URL in browser
await shell.openExternal('https://example.com');

// Show file in folder
await shell.showItemInFolder('/path/to/file.txt');
```

### csv
Wrapper for CSV operations:
```javascript
import { csv } from '@/renderer/api';

// Parse CSV with headers
const data = await csv.parseWithHeaders(csvString);

// Convert CSV file to JSON
const jsonData = await csv.fileToJSON('/path/to/data.csv');
```

### netcanvasFile
Wrapper for Network Canvas protocol file operations:
```javascript
import { netcanvasFile } from '@/renderer/api';

// Import a protocol
const workingPath = await netcanvasFile.importNetcanvas('/path/to/protocol.netcanvas');

// Read protocol data
const protocol = await netcanvasFile.readProtocol(workingPath);

// Save protocol
await netcanvasFile.saveNetcanvas(workingPath, protocol, '/path/to/save.netcanvas');

// Check schema version
const [version, status] = await netcanvasFile.checkSchemaVersion('/path/to/protocol.netcanvas');
```

## Migration Guide

To migrate existing code to use these APIs:

1. **Replace direct imports:**
   ```javascript
   // Before
   import fs from 'fs-extra';
   import { dialog } from 'electron';
   
   // After
   import { fileSystem, dialog } from '@/renderer/api';
   ```

2. **Update method calls to be async:**
   ```javascript
   // Before
   const content = fs.readFileSync('/path/to/file.txt', 'utf8');
   
   // After
   const content = await fileSystem.readFile('/path/to/file.txt', 'utf8');
   ```

3. **Handle errors with try-catch:**
   ```javascript
   try {
     await fileSystem.writeFile('/path/to/file.txt', 'content');
   } catch (error) {
     console.error('Failed to write file:', error);
   }
   ```

## Notes

- All methods are asynchronous and return Promises
- Error handling is preserved from the original implementations
- The APIs maintain compatibility with the original module interfaces where possible
- Some Node.js specific features may not be available due to security restrictions