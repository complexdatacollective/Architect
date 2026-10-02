import { saveDialog } from '@app/utils/dialogs';
import { electronAPI } from '@utils/electronBridge';
import axios from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { actionCreators } from '../userActions';

vi.mock('axios', () => ({ default: { get: vi.fn() } }));

vi.mock('@app/utils/dialogs', async (importOriginal) => ({
  ...(await importOriginal()),
  saveDialog: vi.fn(),
}));

vi.mock('@utils/electronBridge', () => ({
  electronAPI: {
    app: { getPath: vi.fn(async () => '/tmp') },
    path: { join: vi.fn(async (...parts) => parts.join('/')) },
    fs: {
      outputFile: vi.fn(async () => undefined),
      rename: vi.fn(async () => undefined),
      unlink: vi.fn(async () => undefined),
    },
  },
}));

describe('importSampleProtocol', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  // The packaged renderer is sandboxed, so Node's Buffer does not exist there.
  // Under Vitest it does, which hid a `Buffer.from` call that failed every
  // sample download in the app.
  it('writes the downloaded protocol without Node’s Buffer', async () => {
    vi.stubGlobal('Buffer', undefined);
    const bytes = new Uint8Array([0x50, 0x4b, 0x03, 0x04]);
    saveDialog.mockResolvedValue({
      canceled: false,
      filePath: '/chosen/Sample Protocol.netcanvas',
    });
    axios.get.mockResolvedValue({ data: bytes.buffer });

    await actionCreators.importSampleProtocol()(vi.fn());

    expect(electronAPI.fs.outputFile).toHaveBeenCalledWith(
      expect.stringMatching(/^\/tmp\/architect\//),
      bytes,
    );
    expect(electronAPI.fs.rename).toHaveBeenCalledWith(
      expect.stringMatching(/^\/tmp\/architect\//),
      '/chosen/Sample Protocol.netcanvas',
    );
  });
});
