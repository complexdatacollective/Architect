import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock uuid before everything else
vi.mock('uuid', () => ({
  default: vi.fn(() => '809895df-bbd7-4c76-ac58-e6ada2625f9b'),
  v4: vi.fn(() => '809895df-bbd7-4c76-ac58-e6ada2625f9b'),
}));

// Mock electronBridge before importing modules that use it
vi.mock('@utils/electronBridge', () => {
  const mockFs = {
    access: vi.fn(),
    pathExists: vi.fn(),
    readJson: vi.fn(),
    rename: vi.fn(),
    writeFile: vi.fn(),
    writeJson: vi.fn(),
    unlink: vi.fn(),
    mkdirp: vi.fn(),
    stat: vi.fn(),
    copy: vi.fn(),
  };

  const mockPath = {
    join: vi.fn((...args) => args.join('/')),
    parse: vi.fn((p) => {
      const parts = p.split('/');
      const base = parts[parts.length - 1] || '';
      const extIndex = base.lastIndexOf('.');
      const ext = extIndex > 0 ? base.slice(extIndex) : '';
      const name = ext ? base.slice(0, -ext.length) : base;
      return {
        root: p.startsWith('/') ? '/' : '',
        dir: parts.slice(0, -1).join('/'),
        base,
        ext,
        name,
      };
    }),
  };

  const mockApp = {
    getPath: vi.fn(() => '/dev/null/get/electron/path'),
  };

  return {
    electronAPI: {
      fs: mockFs,
      path: mockPath,
      app: mockApp,
    },
    pathSync: {
      join: (...args) => args.filter(Boolean).join('/'),
      basename: (p, ext) => {
        const parts = p.split('/');
        let base = parts[parts.length - 1] || '';
        if (ext && base.endsWith(ext)) {
          base = base.slice(0, -ext.length);
        }
        return base;
      },
    },
  };
});

vi.mock('@app/utils/protocols/lib/archive', () => ({
  archive: vi.fn(),
  extract: vi.fn(),
}));

vi.mock('@codaco/protocol-validation', () => ({
  default: vi.fn(),
  validateProtocol: vi.fn(() => Promise.resolve({ isValid: true })),
}));

vi.mock('@app/utils/pruneProtocolAssets', () => ({
  default: vi.fn(() => Promise.resolve()),
}));

vi.mock('@app/utils/prune', () => ({
  pruneProtocol: vi.fn((protocol) => protocol),
}));

import { electronAPI } from '@utils/electronBridge';
import { pruneProtocol } from '@app/utils/prune';
import pruneProtocolAssets from '@app/utils/pruneProtocolAssets';
import { archive, extract } from '@app/utils/protocols/lib/archive';
import {
  readProtocol,
  deployNetcanvas,
  createNetcanvasExport,
  writeProtocol,
  revertNetcanvas,
  commitNetcanvas,
  importNetcanvas,
} from '../lib';
import { errors } from '../errors';
import { mockProtocolPath } from './helpers';

describe('netcanvasFile/lib', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    electronAPI.fs.writeJson.mockResolvedValue();
    electronAPI.fs.stat.mockImplementation(() => Promise.resolve({
      isFile: false,
    }));
    electronAPI.fs.mkdirp.mockResolvedValue();
  });

  describe('commitNetcanvas({ savePath, backupPath })', () => {
    it('resolves to savePath when no backupPath provided', async () => {
      await expect(
        commitNetcanvas({ savePath: '/dev/null/user/save/path' }),
      )
        .resolves.toEqual('/dev/null/user/save/path');
    });

    it('rejects to an error if savePath does not exist on filesystem', async () => {
      await expect(
        commitNetcanvas({
          savePath: '/dev/null/user/save/path',
          backupPath: '/dev/null/user/save/path.backup',
        }),
      )
        .rejects.toThrow('"/dev/null/user/save/path" (savePath) does not exist');
    });

    it('unlinks backupPath and resolves to savePath', async () => {
      electronAPI.fs.stat.mockImplementation(() => Promise.resolve({
        isFile: true,
      }));

      electronAPI.fs.unlink.mockResolvedValue();

      await expect(
        commitNetcanvas({
          savePath: '/dev/null/user/save/path',
          backupPath: '/dev/null/user/save/path.backup',
        }),
      )
        .resolves.toEqual('/dev/null/user/save/path');

      expect(electronAPI.fs.unlink.mock.calls).toEqual([['/dev/null/user/save/path.backup']]);
    });
  });

  describe('revertNetcanvas({ savePath, backupPath })', () => {
    it('resolves to savePath when no backupPath provided', async () => {
      await expect(
        revertNetcanvas({ savePath: '/dev/null/user/save/path' }),
      )
        .resolves.toEqual('/dev/null/user/save/path');
    });

    it('rejects to an error if backupPath does not exist on filesystem', async () => {
      await expect(
        revertNetcanvas({
          savePath: '/dev/null/user/save/path',
          backupPath: '/dev/null/user/save/path.backup',
        }),
      )
        .rejects.toThrow('"/dev/null/user/save/path.backup" (backupPath) does not exist');
    });

    it('unlinks savePath, renames backup, and resolves to savePath', async () => {
      electronAPI.fs.stat.mockImplementation(() => Promise.resolve({
        isFile: true,
      }));

      electronAPI.fs.unlink.mockResolvedValue();

      await expect(
        revertNetcanvas({
          savePath: '/dev/null/user/save/path',
          backupPath: '/dev/null/user/save/path.backup',
        }),
      )
        .resolves.toEqual('/dev/null/user/save/path');

      expect(electronAPI.fs.unlink.mock.calls).toEqual([['/dev/null/user/save/path']]);
      expect(electronAPI.fs.rename.mock.calls).toEqual([[
        '/dev/null/user/save/path.backup',
        '/dev/null/user/save/path',
      ]]);
    });
  });

  describe('writeProtocol(workingPath, protocol)', () => {
    it('rejects to a write error if write fails', async () => {
      electronAPI.fs.writeJson.mockRejectedValue(new Error('oh no'));

      await expect(
        writeProtocol('/dev/null/working/path', {}),
      ).rejects.toMatchObject({ friendlyCode: errors.WriteError });
    });

    it('resolves to pruned version of protocol', async () => {
      pruneProtocol.mockImplementation((protocol) => ({ ...protocol, pruned: true }));

      await expect(
        writeProtocol('/dev/null/working/path', {}),
      ).resolves.toMatchObject({ pruned: true });
    });
  });

  describe('readProtocol(protocolPath)', () => {
    it('Rejects with a human readable error when protocol cannot be parsed', async () => {
      electronAPI.fs.readJson.mockImplementation(() => new Promise((resolve, reject) => {
        try {
          JSON.parse('malformatted json');
        } catch (e) {
          return reject(e);
        }

        return resolve();
      }));

      await expect(
        readProtocol('/var/null/'),
      ).rejects.toMatchObject({ friendlyCode: errors.ReadError });
    });

    it('Resolves to protocol', async () => {
      electronAPI.fs.readJson.mockResolvedValueOnce({});

      await expect(
        readProtocol('/var/null/'),
      ).resolves.toEqual({});
    });
  });

  describe('deployNetcanvas(exportPath, destinationPath)', () => {
    const netcanvasFilePath = '/dev/null/get/electron/path/architect/exports/pendingExport';
    const userDestinationPath = '/dev/null/user/path/export/destination';

    it('does not create a backup if destination does not already exist', async () => {
      electronAPI.fs.rename.mockResolvedValueOnce(true);
      electronAPI.fs.pathExists.mockResolvedValueOnce(false);
      electronAPI.fs.copy.mockResolvedValueOnce(true);

      const result = await deployNetcanvas(
        netcanvasFilePath,
        userDestinationPath,
      );

      expect(electronAPI.fs.rename.mock.calls.length).toBe(0);
      expect(electronAPI.fs.copy.mock.calls[0]).toEqual([
        '/dev/null/get/electron/path/architect/exports/pendingExport',
        '/dev/null/user/path/export/destination',
      ]);

      expect(result).toEqual({
        backupPath: null,
        savePath: userDestinationPath,
      });
    });

    it('creates a backup if destination does exist', async () => {
      electronAPI.fs.rename.mockResolvedValue(true);
      electronAPI.fs.pathExists.mockResolvedValue(true);

      const result = await deployNetcanvas(
        netcanvasFilePath,
        userDestinationPath,
      );

      expect(electronAPI.fs.rename.mock.calls.length).toBe(1);
      expect(electronAPI.fs.rename.mock.calls[0]).toEqual([
        '/dev/null/user/path/export/destination',
        expect.stringMatching(/\/dev\/null\/user\/path\/export\/destination\.backup-[0-9]+/),
      ]);
      expect(electronAPI.fs.copy.mock.calls[0]).toEqual([
        '/dev/null/get/electron/path/architect/exports/pendingExport',
        '/dev/null/user/path/export/destination',
      ]);

      expect(result).toEqual({
        backupPath: expect.stringMatching(/\/dev\/null\/user\/path\/export\/destination\.backup-[0-9]+/),
        savePath: userDestinationPath,
      });
    });
  });

  describe('createNetcanvasExport(workingPath, protocol)', () => {
    it('resolves to a uuid path in temp', async () => {
      electronAPI.fs.mkdirp.mockResolvedValue();
      pruneProtocol.mockImplementation((protocol) => Promise.resolve(protocol));
      electronAPI.fs.writeJson.mockResolvedValue();
      pruneProtocolAssets.mockResolvedValueOnce();
      archive.mockResolvedValueOnce();

      await expect(createNetcanvasExport('/dev/null/existing/working/path', {}))
        .resolves.toEqual('/dev/null/get/electron/path/architect/exports/809895df-bbd7-4c76-ac58-e6ada2625f9b');
    });
  });

  describe('importNetcanvas(filePath)', () => {
    beforeEach(() => {
      archive.mockRejectedValue();
    });

    it('rejects with a readable error when permissions are wrong', async () => {
      electronAPI.fs.access.mockResolvedValue(false);

      await expect(() => importNetcanvas(mockProtocolPath))
        .rejects.toMatchObject({ friendlyCode: errors.OpenFailed });
    });

    it('rejects with a readable error when it cannot extract a protocol', async () => {
      extract.mockRejectedValue(new Error());
      electronAPI.fs.access.mockResolvedValue(true);

      await expect(importNetcanvas(mockProtocolPath))
        .rejects.toMatchObject({ friendlyCode: errors.OpenFailed });
    });

    it('resolves to a uuid path in temp', async () => {
      electronAPI.fs.access.mockResolvedValue(true);
      extract.mockResolvedValue();

      await expect(importNetcanvas(mockProtocolPath))
        .resolves.toEqual('/dev/null/get/electron/path/architect/protocols/809895df-bbd7-4c76-ac58-e6ada2625f9b');
    });
  });
});
