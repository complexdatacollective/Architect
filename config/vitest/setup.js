import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Configure Enzyme
configure({ adapter: new Adapter() });

// Handle uncaught exceptions from framesync during test cleanup
// framesync (used by framer-motion 5.x) schedules timers that may fire after
// jsdom tears down the window object, causing "window is not defined" errors.
// This is a known issue with framer-motion 5.x - upgrading to v6+ would fix it
// but requires significant migration work. This handler suppresses only this
// specific error during test cleanup.
process.on('uncaughtException', (error) => {
  if (error.message === 'window is not defined'
      && error.stack?.includes('framesync')) {
    // Suppress framesync cleanup errors - these don't affect test results
    return;
  }
  // Re-throw all other errors
  throw error;
});

// Polyfills for animation APIs
const rafPolyfill = (callback) => setTimeout(callback, 16);
const cafPolyfill = (id) => clearTimeout(id);

global.requestAnimationFrame = rafPolyfill;
global.cancelAnimationFrame = cafPolyfill;
globalThis.requestAnimationFrame = rafPolyfill;
globalThis.cancelAnimationFrame = cafPolyfill;

global.SVGElement = global.Element;

// Mock window.electronAPI (for context isolation)
window.electronAPI = {
  fs: {
    readJson: vi.fn(() => Promise.resolve({})),
    writeJson: vi.fn(() => Promise.resolve()),
    copy: vi.fn(() => Promise.resolve()),
    unlink: vi.fn(() => Promise.resolve()),
    mkdirp: vi.fn(() => Promise.resolve()),
    exists: vi.fn(() => Promise.resolve(true)),
    readFile: vi.fn(() => Promise.resolve('{}')),
    writeFile: vi.fn(() => Promise.resolve()),
    stat: vi.fn(() => Promise.resolve({ isFile: () => true })),
    remove: vi.fn(() => Promise.resolve()),
    emptyDir: vi.fn(() => Promise.resolve()),
    ensureDir: vi.fn(() => Promise.resolve()),
    readdir: vi.fn(() => Promise.resolve([])),
    access: vi.fn(() => Promise.resolve()),
    pathExists: vi.fn(() => Promise.resolve(true)),
  },
  dialog: {
    showOpenDialog: vi.fn(() => Promise.resolve({ canceled: false, filePaths: ['/fake/path'] })),
    showSaveDialog: vi.fn(() => Promise.resolve({ canceled: false, filePath: '/fake/path.netcanvas' })),
    showMessageBox: vi.fn(() => Promise.resolve({ response: 0 })),
  },
  app: {
    getPath: vi.fn(() => Promise.resolve('/fake/path')),
    getAppPath: vi.fn(() => Promise.resolve('/fake/app/path')),
    getVersion: vi.fn(() => Promise.resolve('0.0.0')),
  },
  path: {
    join: vi.fn((...args) => Promise.resolve(args.join('/'))),
    basename: vi.fn((p) => p.split('/').pop()),
    dirname: vi.fn((p) => p.split('/').slice(0, -1).join('/')),
    extname: vi.fn((p) => {
      const parts = p.split('.');
      return parts.length > 1 ? `.${parts.pop()}` : '';
    }),
    parse: vi.fn((p) => ({
      root: '/',
      dir: p.split('/').slice(0, -1).join('/'),
      base: p.split('/').pop(),
      ext: p.includes('.') ? `.${p.split('.').pop()}` : '',
      name: p.split('/').pop().split('.')[0],
    })),
  },
  archive: {
    create: vi.fn(() => Promise.resolve()),
    extract: vi.fn(() => Promise.resolve()),
  },
  shell: {
    openExternal: vi.fn(),
  },
  window: {
    hide: vi.fn(),
  },
  webContents: {
    printToPDF: vi.fn(() => Promise.resolve(Buffer.from([]))),
  },
  ipc: {
    send: vi.fn(),
    on: vi.fn(),
  },
};

// Provide Jest compatibility (jest.fn() -> vi.fn())
global.jest = vi;

// Auto-mock modules that need it
vi.mock('@codaco/ui/lib/utils/CSSVariables');
vi.mock('mapbox-gl/dist/mapbox-gl-unminified');
vi.mock('mapbox-gl/dist/mapbox-gl.css', () => ({}));

// Mock @codaco/ui to avoid ESM resolution issues with the package's internal imports
vi.mock('@codaco/ui', async () => {
  const React = await import('react');
  return {
    Button: ({ children, ...props }) => React.createElement('button', { type: 'button', ...props }, children),
    Icon: ({ name, className, ...props }) => React.createElement('span', { className: `icon ${className || ''}`, 'data-icon': name, ...props }),
    GraphicButton: ({ children, ...props }) => React.createElement('button', { type: 'button', ...props }, children),
    Node: ({ children, ...props }) => React.createElement('div', { className: 'node', ...props }, children),
    Spinner: () => React.createElement('div', { className: 'spinner' }),
    ProgressBar: ({ percentProgress }) => React.createElement('div', { className: 'progress-bar', style: { width: `${percentProgress}%` } }),
    Scroller: ({ children }) => React.createElement('div', { className: 'scroller' }, children),
    ToastManager: ({ children }) => React.createElement('div', { className: 'toast-manager' }, children),
  };
});
