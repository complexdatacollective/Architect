/* eslint-env jest */

import fse from 'fs-extra';
import uuid from 'uuid';
import { APP_SCHEMA_VERSION } from '@app/config';
import { extract, archive } from '@app/utils/protocols/lib/archive';
import { canUpgrade, migrateProtocol } from '@codaco/protocol-validation';
import validateProtocol from '@app/utils/validateProtocol';
import { pruneProtocol } from '@app/utils/prune';
import {
  checkSchemaVersion,
  importNetcanvas,
  migrateNetcanvas,
  saveNetcanvas,
  schemaVersionStates,
  createNetcanvas,
  validateNetcanvas,
  utils,
} from '../netcanvasFile';
import {
  commitNetcanvas,
  deployNetcanvas,
  getTempDir,
  readProtocol,
  revertNetcanvas,
  writeProtocol,
  createNetcanvasExport,
} from '../lib';
import { errors } from '../errors';
import {
  mockProtocolPath,
  mockProtocol,
} from './helpers';

jest.mock('fs-extra');
jest.mock('@app/utils/protocols/lib/archive');
jest.mock('@codaco/protocol-validation');
jest.mock('@app/utils/pruneProtocolAssets');
jest.mock('@app/utils/prune');
jest.mock('../lib');
jest.mock('@app/utils/validateProtocol');

const {
  verifyNetcanvas,
} = utils;

describe('netcanvasFile/netcanvasFile', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    uuid.mockImplementation(jest.fn(() => '809895df-bbd7-4c76-ac58-e6ada2625f9b'));

    fse.access.mockResolvedValue(Promise.resolve());
    archive.mockImplementation(() => Promise.resolve());
    extract.mockImplementation(() => Promise.resolve());
    pruneProtocol.mockImplementation((protocol = {}) => Promise.resolve(protocol));
    let count = 0;
    getTempDir.mockImplementation(() => {
      count += 1;
      return Promise.resolve(`/dev/null/working/path/${count}`);
    });
    writeProtocol.mockResolvedValue();
    deployNetcanvas.mockImplementation((sourcePath, savePath) => Promise.resolve({
      savePath,
      backupPath: `${savePath}.backup`,
    }));
    revertNetcanvas.mockImplementation(({ savePath }) => Promise.resolve(savePath));
    commitNetcanvas.mockImplementation(({ savePath }) => Promise.resolve(savePath));
    readProtocol.mockResolvedValue(mockProtocol);
    createNetcanvasExport.mockImplementation(() => Promise.resolve('/dev/null/export/working/path'));
    importNetcanvas.mockImplementation((netcanvasPath) => Promise.resolve(netcanvasPath));
    fse.mkdirp.mockResolvedValue();
  });

  it.todo('schemaVersionStates');

  describe('createNetcanvas(destinationPath)', () => {
    it('creates an assetPath and workingPath', async () => {
      await createNetcanvas('/dev/null/new/user/netcanvas/path');

      expect(fse.mkdirp.mock.calls).toEqual([[
        '/dev/null/working/path/1/809895df-bbd7-4c76-ac58-e6ada2625f9b/assets',
      ]]);
    });

    it('creates a protocol with te current APP_SCHEMA_VERSION', async () => {
      await createNetcanvas('/dev/null/new/user/netcanvas/path');

      expect(createNetcanvasExport.mock.calls).toMatchObject([[
        '/dev/null/working/path/1/809895df-bbd7-4c76-ac58-e6ada2625f9b',
        {
          assetManifest: {},
          codebook: {
            edge: {},
            ego: {},
            node: {},
          },
          schemaVersion: APP_SCHEMA_VERSION,
          stages: [],
        },
      ]]);
    });

    it('deploys the export and resolves to destinationPath', async () => {
      await expect(createNetcanvas('/dev/null/new/user/netcanvas/path'))
        .resolves.toEqual('/dev/null/new/user/netcanvas/path');

      expect(deployNetcanvas.mock.calls).toEqual([[
        '/dev/null/export/working/path',
        '/dev/null/new/user/netcanvas/path',
      ]]);
    });
  });

  describe('validateNetcanvas(filePath)', () => {
    it('imports and validates protocol then resolves to filePath', async () => {
      const testProtocol = { test: 'protocol' };
      readProtocol.mockResolvedValue(testProtocol);
      importNetcanvas.mockResolvedValue('/dev/null/netcanvas/file');
      await expect(validateNetcanvas('/dev/null/netcanvas/file'))
        .resolves.toEqual('/dev/null/netcanvas/file');

      expect(importNetcanvas.mock.calls).toEqual([['/dev/null/netcanvas/file']]);
      expect(readProtocol.mock.calls).toEqual([['/dev/null/netcanvas/file']]);
      expect(validateProtocol.mock.calls).toEqual([[testProtocol]]);
    });
  });

  describe('migrateNetcanvas()', () => {
    it('resolves to new file path', async () => {
      readProtocol
        .mockResolvedValueOnce({ ...mockProtocol, schemaVersion: 2 })
        .mockResolvedValueOnce({ ...mockProtocol, schemaVersion: 4 });

      migrateProtocol.mockResolvedValueOnce(
        { ...mockProtocol, schemaVersion: 4 },
      );

      const result = await migrateNetcanvas('/dev/null/original/path', '/dev/null/destination/path2');

      expect(result).toBe('/dev/null/destination/path2');
    });
  });

  describe('checkSchemaVersion(protocol, schemaVersion [optional])', () => {
    it('returns errors.MissingSchemaVersion if no schema version in protocol', async () => {
      readProtocol.mockResolvedValueOnce({});

      await expect(checkSchemaVersion('/dev/null/netcanvas/file'))
        .rejects.toEqual(errors.MissingSchemaVersion);
    });

    it('returns [, schemaVersionStates.OK] if protocol is a match', async () => {
      readProtocol.mockResolvedValueOnce({ schemaVersion: 3 });

      await expect(checkSchemaVersion('/dev/null/netcanvas/file', 3))
        .resolves.toEqual([3, schemaVersionStates.OK]);
    });

    it('returns [, schemaVersionStates.UPGRADE_PROTOCOL] if protocol can upgrade', async () => {
      readProtocol.mockResolvedValueOnce({ schemaVersion: 2 });
      canUpgrade.mockReturnValue(true);

      await expect(checkSchemaVersion('/dev/null/netcanvas/file', 3))
        .resolves.toEqual([2, schemaVersionStates.UPGRADE_PROTOCOL]);
    });

    it('returns [, schemaVersionStates.UPGRADE_APP] if protocol cannot upgrade', async () => {
      readProtocol.mockResolvedValueOnce({ schemaVersion: 4 });
      canUpgrade.mockReturnValue(false);

      await expect(checkSchemaVersion('/dev/null/netcanvas/file', 3))
        .resolves.toEqual([4, schemaVersionStates.UPGRADE_APP]);
    });

    it('defaults to APP_SCHEMA_VERSION', async () => {
      readProtocol.mockResolvedValueOnce({ schemaVersion: APP_SCHEMA_VERSION });

      await expect(checkSchemaVersion('/dev/null/netcanvas/file'))
        .resolves.toEqual([APP_SCHEMA_VERSION, schemaVersionStates.OK]);
    });
  });

  describe('saveNetcanvas(workingPath, protocol, filePath)', () => {
    it('successful save', async () => {
      const result = await saveNetcanvas(
        '/dev/null/existing/working/path',
        mockProtocol,
        '/dev/null/save/destination/path',
      );

      expect(result).toBe('/dev/null/save/destination/path');

      expect(createNetcanvasExport.mock.calls).toEqual([[
        '/dev/null/existing/working/path',
        mockProtocol,
      ]]);
      expect(deployNetcanvas.mock.calls).toEqual([[
        '/dev/null/export/working/path',
        '/dev/null/save/destination/path',
      ]]);
      expect(commitNetcanvas.mock.calls).toEqual([[{
        backupPath: '/dev/null/save/destination/path.backup',
        savePath: '/dev/null/save/destination/path',
      }]]);
      expect(revertNetcanvas.mock.calls).toHaveLength(0);
    });

    it('if export fails at verifyNetcanvas it reverts the file', async () => {
      readProtocol.mockResolvedValue({});

      await expect(
        saveNetcanvas(
          '/dev/null/existing/working/path',
          mockProtocol,
          '/dev/null/save/destination/path',
        ),
      ).rejects.toThrow();

      expect(deployNetcanvas.mock.calls).toEqual([[
        '/dev/null/export/working/path',
        '/dev/null/save/destination/path',
      ]]);
      expect(commitNetcanvas.mock.calls).toHaveLength(0);
      expect(revertNetcanvas.mock.calls).toEqual([[{
        backupPath: '/dev/null/save/destination/path.backup',
        savePath: '/dev/null/save/destination/path',
      }]]);
    });

    it('if deployNetcanvas fails it aborts the save', async () => {
      deployNetcanvas.mockRejectedValue(new Error('oh no'));

      await expect(
        saveNetcanvas(
          '/dev/null/existing/working/path',
          mockProtocol,
          '/dev/null/save/destination/path',
        ),
      ).rejects.toThrow();

      expect(deployNetcanvas.mock.calls).toEqual([[
        '/dev/null/export/working/path',
        '/dev/null/save/destination/path',
      ]]);
      expect(commitNetcanvas.mock.calls).toHaveLength(0);
      expect(revertNetcanvas.mock.calls).toHaveLength(0);
    });

    describe('when path does not already exist', () => {
      beforeEach(() => {
        deployNetcanvas.mockImplementation((sourcePath, savePath) => Promise.resolve({
          savePath,
          backupPath: null,
        }));
      });

      it('successful save', async () => {
        const result = await saveNetcanvas(
          '/dev/null/existing/working/path',
          mockProtocol,
          '/dev/null/save/destination/path',
        );

        expect(result).toBe('/dev/null/save/destination/path');

        expect(createNetcanvasExport.mock.calls).toEqual([[
          '/dev/null/existing/working/path',
          mockProtocol,
        ]]);
        expect(deployNetcanvas.mock.calls).toEqual([[
          '/dev/null/export/working/path',
          '/dev/null/save/destination/path',
        ]]);
        expect(commitNetcanvas.mock.calls).toEqual([[{
          backupPath: null,
          savePath: '/dev/null/save/destination/path',
        }]]);
        expect(revertNetcanvas.mock.calls).toHaveLength(0);
      });

      it('when verifyNetcanvas fails, throws but does not revert', async () => {
        readProtocol.mockResolvedValue({});

        await expect(
          saveNetcanvas(
            '/dev/null/existing/working/path',
            mockProtocol,
            '/dev/null/save/destination/path',
          ),
        ).rejects.toThrow();

        expect(deployNetcanvas.mock.calls).toEqual([[
          '/dev/null/export/working/path',
          '/dev/null/save/destination/path',
        ]]);
        expect(commitNetcanvas.mock.calls).toHaveLength(0);
        expect(revertNetcanvas.mock.calls).toEqual([[{
          backupPath: null,
          savePath: '/dev/null/save/destination/path',
        }]]);
      });

      it('if deployNetcanvas fails it aborts the save', async () => {
        deployNetcanvas.mockRejectedValue(new Error('oh no'));

        await expect(
          saveNetcanvas(
            '/dev/null/existing/working/path',
            mockProtocol,
            '/dev/null/save/destination/path',
          ),
        ).rejects.toThrow();

        expect(deployNetcanvas.mock.calls).toEqual([[
          '/dev/null/export/working/path',
          '/dev/null/save/destination/path',
        ]]);
        expect(commitNetcanvas.mock.calls).toHaveLength(0);
        expect(revertNetcanvas.mock.calls).toHaveLength(0);
      });
    });
  });

  describe('verifyNetcanvas(filePath)', () => {
    it('Rejects with a human readable error when verification fails', async () => {
      readProtocol.mockResolvedValue({ schemaVersion: 4 });

      await expect(verifyNetcanvas(mockProtocolPath, {}))
        .rejects.toMatchObject({ friendlyCode: errors.VerificationFailed });
    });

    it('Resolves to filePath if validation passes', async () => {
      readProtocol.mockResolvedValue({ schemaVersion: 4 });

      await expect(verifyNetcanvas(mockProtocolPath, { schemaVersion: 4 }))
        .resolves.toEqual(mockProtocolPath);
    });
  });
});
