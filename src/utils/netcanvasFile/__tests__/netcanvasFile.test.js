/* eslint-env jest */

import fse from 'fs-extra';
import path from 'path';
import { APP_SCHEMA_VERSION } from '@app/config';
import { extract, archive } from '@app/utils/protocols/lib/archive';
import pruneProtocolAssets from '@app/utils/pruneProtocolAssets';
import migrateProtocol from '@app/protocol-validation/migrations/migrateProtocol';
import { pruneProtocol } from '@app/utils/prune';
import {
  checkSchemaVersion,
  errors,
  importNetcanvas,
  migrateNetcanvas,
  saveNetcanvas,
  schemaVersionStates,
  utils,
} from '../netcanvasFile';
import {
  commitNetcanvas,
  deployNetcanvas,
  getTempDir,
  readProtocol,
  revertNetcanvas,
  writeProtocol,
} from '../lib';
import {
  mockProtocolPath,
  mockProtocol,
  mockAndLog,
} from './helpers';

jest.mock('fs-extra');
jest.mock('@app/utils/protocols/lib/archive');
jest.mock('@app/protocol-validation/migrations/migrateProtocol');
jest.mock('@app/utils/pruneProtocolAssets');
jest.mock('@app/utils/prune');
jest.mock('../lib');

const {
  createNetcanvasExport,
  verifyNetcanvas,
} = utils;

describe('netcanvasFile/netcanvasFile', () => {
  beforeEach(() => {
    archive.mockReset();
    extract.mockReset();
    fse.access.mockReset();
    fse.pathExists.mockReset();
    fse.readJson.mockReset();
    fse.rename.mockReset();
    fse.writeFile.mockReset();
    pruneProtocol.mockReset();
    pruneProtocolAssets.mockReset();
    fse.unlink.mockReset();
    fse.access.mockReset();

    let count = 0;
    getTempDir.mockImplementation(() => {
      count += 1;
      return Promise.resolve(`/dev/null/working/path/${count}`);
    });
  });

  it.todo('errors');
  it.todo('schemaVersionStates');

  it.todo('createNetcanvas()');

  describe.only('migrateNetcanvas()', () => {
    it('resolves to new file path', async () => {
      readProtocol
        .mockResolvedValueOnce({ ...mockProtocol, schemaVersion: 2 })
        .mockResolvedValueOnce({ ...mockProtocol, schemaVersion: 4 });
      writeProtocol.mockResolvedValueOnce();
      deployNetcanvas.mockImplementation((sourcePath, savePath) => Promise.resolve({
        savePath,
        backupPath: `${savePath}.backup`,
      }));
      revertNetcanvas.mockImplementation(({ savePath }) => Promise.resolve(savePath));
      migrateProtocol.mockResolvedValueOnce(
        [{ ...mockProtocol, schemaVersion: 4 }, []],
      );
      commitNetcanvas.mockImplementation(({ savePath }) => Promise.resolve(savePath));
      fse.access.mockResolvedValue(Promise.resolve());
      archive.mockImplementation(() => Promise.resolve());
      pruneProtocol.mockImplementation((protocol = {}) => Promise.resolve(protocol));

      const result = await migrateNetcanvas('/dev/null/original/path', '/dev/null/destination/path2');

      expect(result).toBe('/dev/null/destination/path2');
    });
  });

  describe('checkSchemaVersion(protocol, schemaVersion [optional])', () => {
    const defaultMocks = {
      mkdirp: [fse.mkdirp, Promise.resolve()],
      access: [fse.access, Promise.resolve()],
      extract: [extract, Promise.resolve()],
    };

    it('returns errors.MissingSchemaVersion if no schema version in protocol', async () => {
      mockAndLog({
        ...defaultMocks,
        readJson: [fse.readJson, Promise.resolve({})],
      });

      await expect(checkSchemaVersion('/dev/null/netcanvas/file'))
        .rejects.toEqual(errors.MissingSchemaVersion);
    });

    it('returns [, schemaVersionStates.OK] if protocol is a match', async () => {
      mockAndLog({
        ...defaultMocks,
        readJson: [fse.readJson, Promise.resolve({ schemaVersion: 3 })],
      });

      await expect(checkSchemaVersion('/dev/null/netcanvas/file', 3))
        .resolves.toEqual([3, schemaVersionStates.OK]);
    });

    it('returns [, schemaVersionStates.UPGRADE_PROTOCOL] if protocol can upgrade', async () => {
      mockAndLog({
        ...defaultMocks,
        readJson: [fse.readJson, Promise.resolve({ schemaVersion: 2 })],
      });

      await expect(checkSchemaVersion('/dev/null/netcanvas/file', 3))
        .resolves.toEqual([2, schemaVersionStates.UPGRADE_PROTOCOL]);
    });

    it('returns [, schemaVersionStates.UPGRADE_AGG] if protocol cannot upgrade', async () => {
      mockAndLog({
        ...defaultMocks,
        readJson: [fse.readJson, Promise.resolve({ schemaVersion: 4 })],
      });

      await expect(checkSchemaVersion('/dev/null/netcanvas/file', 3))
        .resolves.toEqual([4, schemaVersionStates.UPGRADE_APP]);
    });

    it('defaults to APP_SCHEMA_VERSION', async () => {
      mockAndLog({
        ...defaultMocks,
        readJson: [fse.readJson, Promise.resolve({ schemaVersion: APP_SCHEMA_VERSION })],
      });

      await expect(checkSchemaVersion('/dev/null/netcanvas/file'))
        .resolves.toEqual([APP_SCHEMA_VERSION, schemaVersionStates.OK]);
    });
  });

  describe('saveNetcanvas(workingPath, protocol, filePath)', () => {
    const expectBackupPath = expect.stringMatching(/\/dev\/null\/destination\/path\.backup-[0-9]+/);

    const successfulMocks = {
      'fse.writeJson': [fse.writeJson, Promise.resolve()],
      pruneProtocolAssets: [pruneProtocolAssets, Promise.resolve()],
      pruneProtocol: [pruneProtocol, Promise.resolve(mockProtocol)],
      'fse.readJson': [fse.readJson, Promise.resolve(mockProtocol)],
      'fse.pathExists': [fse.pathExists, Promise.resolve(true)],
      'fse.stat': [fse.stat, Promise.resolve({ isFile: () => Promise.resolve(true) })],
      'fse.access': [fse.access, Promise.resolve()],
    };

    it('successful save', async () => {
      mockAndLog(successfulMocks);

      const logger = mockAndLog({
        'fse.rename': [fse.rename, Promise.resolve()],
        'fse.unlink': [fse.unlink, Promise.resolve()],
        'fse.writeJson': [fse.writeJson, Promise.resolve()],
        archive: [archive, Promise.resolve()],
      });

      const result = await saveNetcanvas('/dev/null/working/path', mockProtocol, '/dev/null/destination/path');

      expect(result).toBe('/dev/null/destination/path');

      expect(logger.mock.calls).toEqual(
        [
          ['fse.writeJson',
            ['/dev/null/working/path/protocol.json', { description: 'test protocol' }, { spaces: 2 }]],
          ['archive',
            ['/dev/null/working/path', '/dev/null/get/electron/path/architect/exports/809895df-bbd7-4c76-ac58-e6ada2625f9b']],
          ['fse.rename',
            ['/dev/null/destination/path', expectBackupPath]],
          ['fse.rename',
            ['/dev/null/get/electron/path/architect/exports/809895df-bbd7-4c76-ac58-e6ada2625f9b', '/dev/null/destination/path']],
          ['fse.unlink',
            [expectBackupPath]],
        ],
      );
    });

    it('if export fails at verifyNetcanvas it reverts the file', async () => {
      /**
       * Mocks to get to verifyNetcanvas step and then return mismatching
       * values for comparison failing the test
       */
      mockAndLog({
        ...successfulMocks,
        'fse.readJson': [fse.readJson, Promise.resolve({ first: 'attempt' })],
      });

      const logger = mockAndLog({
        'fse.rename': [fse.rename, Promise.resolve()],
        'fse.unlink': [fse.unlink, Promise.resolve()],
        'fse.writeJson': [fse.writeJson, Promise.resolve()],
        archive: [archive, Promise.resolve()],
      });

      await expect(saveNetcanvas('/dev/null/working/path', mockProtocol, '/dev/null/destination/path')).rejects.toThrow();

      expect(logger.mock.calls).toEqual(
        [
          ['fse.writeJson',
            ['/dev/null/working/path/protocol.json', { description: 'test protocol' }, { spaces: 2 }]],
          ['archive',
            ['/dev/null/working/path', '/dev/null/get/electron/path/architect/exports/809895df-bbd7-4c76-ac58-e6ada2625f9b']],
          ['fse.rename',
            ['/dev/null/destination/path', expectBackupPath]],
          ['fse.rename',
            ['/dev/null/get/electron/path/architect/exports/809895df-bbd7-4c76-ac58-e6ada2625f9b', '/dev/null/destination/path']],
          ['fse.unlink',
            ['/dev/null/destination/path']],
          ['fse.rename',
            [expectBackupPath, '/dev/null/destination/path']],
        ],
      );
    });

    it('if deployNetcanvas fails it aborts the save', async () => {
      mockAndLog({
        ...successfulMocks,
      });

      const logger = mockAndLog({
        'fse.rename': [fse.rename, Promise.reject()],
        'fse.unlink': [fse.unlink, Promise.resolve()],
        'fse.writeJson': [fse.writeJson, Promise.resolve()],
        archive: [archive, Promise.resolve()],
      });

      await expect(saveNetcanvas('/dev/null/working/path', mockProtocol, '/dev/null/destination/path')).rejects.toThrow();

      expect(logger.mock.calls).toEqual(
        [
          ['fse.writeJson',
            ['/dev/null/working/path/protocol.json', { description: 'test protocol' }, { spaces: 2 }]],
          ['archive',
            ['/dev/null/working/path', '/dev/null/get/electron/path/architect/exports/809895df-bbd7-4c76-ac58-e6ada2625f9b']],
          // `fse.rename` is the call that was made to fail, so no changes have been made to disk:
          ['fse.rename',
            ['/dev/null/destination/path', expectBackupPath]],
        ],
      );
    });

    describe('when path does not already exist', () => {
      const pathDoesNotExistMock = {
        'fse.pathExists': [fse.pathExists, Promise.resolve(false)],
      };

      it('successful save', async () => {
        mockAndLog({
          ...successfulMocks,
          ...pathDoesNotExistMock,
        });
        const logger = mockAndLog({
          'fse.rename': [fse.rename, Promise.resolve()],
          'fse.unlink': [fse.unlink, Promise.resolve()],
          'fse.writeJson': [fse.writeJson, Promise.resolve()],
          archive: [archive, Promise.resolve()],
        });

        await saveNetcanvas('/dev/null/working/path', mockProtocol, '/dev/null/destination/path');

        expect(logger.mock.calls).toEqual(
          [
            ['fse.writeJson',
              ['/dev/null/working/path/protocol.json', { description: 'test protocol' }, { spaces: 2 }]],
            ['archive',
              ['/dev/null/working/path', '/dev/null/get/electron/path/architect/exports/809895df-bbd7-4c76-ac58-e6ada2625f9b']],
            ['fse.rename',
              ['/dev/null/get/electron/path/architect/exports/809895df-bbd7-4c76-ac58-e6ada2625f9b', '/dev/null/destination/path']],
          ],
        );
      });

      it('when verifyNetcanvas fails, throws but does not revert', async () => {
        mockAndLog({
          ...successfulMocks,
          ...pathDoesNotExistMock,
          'fse.readJson': [fse.readJson, Promise.resolve({ first: 'attempt' })],
        });

        const logger = mockAndLog({
          'fse.rename': [fse.rename, Promise.resolve()],
          'fse.unlink': [fse.unlink, Promise.resolve()],
          'fse.writeJson': [fse.writeJson, Promise.resolve()],
          archive: [archive, Promise.resolve()],
        });

        await expect(saveNetcanvas('/dev/null/working/path', mockProtocol, '/dev/null/destination/path')).rejects.toThrow();

        expect(logger.mock.calls).toEqual(
          [
            ['fse.writeJson',
              ['/dev/null/working/path/protocol.json', { description: 'test protocol' }, { spaces: 2 }]],
            ['archive',
              ['/dev/null/working/path', '/dev/null/get/electron/path/architect/exports/809895df-bbd7-4c76-ac58-e6ada2625f9b']],
            ['fse.rename',
              ['/dev/null/get/electron/path/architect/exports/809895df-bbd7-4c76-ac58-e6ada2625f9b', '/dev/null/destination/path']],
          ],
        );
      });

      it('if deployNetcanvas fails it aborts the save', async () => {
        mockAndLog({
          ...successfulMocks,
          ...pathDoesNotExistMock,
        });

        const logger = mockAndLog({
          'fse.rename': [fse.rename, Promise.reject()],
          'fse.unlink': [fse.unlink, Promise.resolve()],
          'fse.writeJson': [fse.writeJson, Promise.resolve()],
          archive: [archive, Promise.resolve()],
        });

        await expect(saveNetcanvas('/dev/null/working/path', mockProtocol, '/dev/null/destination/path')).rejects.toThrow();

        expect(logger.mock.calls).toEqual(
          [
            ['fse.writeJson',
              ['/dev/null/working/path/protocol.json', { description: 'test protocol' }, { spaces: 2 }]],
            ['archive',
              ['/dev/null/working/path', '/dev/null/get/electron/path/architect/exports/809895df-bbd7-4c76-ac58-e6ada2625f9b']],
            // `fse.rename` is the call that was made to fail, so no changes have been made to disk:
            ['fse.rename',
              ['/dev/null/get/electron/path/architect/exports/809895df-bbd7-4c76-ac58-e6ada2625f9b', '/dev/null/destination/path']],
          ],
        );
      });
    });
  });


  describe('createNetcanvasExport(workingPath, protocol)', () => {
    const workingPath = path.join('dev', 'null');
    const circularProtocol = {};
    circularProtocol.a = { b: circularProtocol };

    it('resolves to a uuid path in temp', async () => {
      fse.readJson.mockResolvedValueOnce({});
      fse.writeJson.mockResolvedValue(true);
      pruneProtocolAssets.mockResolvedValueOnce(true);
      pruneProtocol.mockReturnValueOnce({});
      archive.mockResolvedValueOnce(true);

      await expect(createNetcanvasExport(workingPath, {}))
        .resolves.toEqual('/dev/null/get/electron/path/architect/exports/809895df-bbd7-4c76-ac58-e6ada2625f9b');
    });
  });

  describe('importNetcanvas(filePath)', () => {
    it('rejects with a readable error when permissions are wrong', async () => {
      const accessError = new Error();
      accessError.code = 'EACCES';

      fse.access.mockRejectedValueOnce(accessError);

      await expect(() => importNetcanvas(mockProtocolPath))
        .rejects.toMatchObject({ friendlyCode: errors.IncorrectPermissions });
    });

    it('rejects with a readable error when it cannot extract a protocol', async () => {
      fse.access.mockResolvedValueOnce(true);
      extract.mockRejectedValueOnce(new Error());

      await expect(importNetcanvas(mockProtocolPath))
        .rejects.toMatchObject({ friendlyCode: errors.OpenFailed });
    });

    it('resolves to a uuid path in temp', async () => {
      fse.access.mockResolvedValueOnce(true);
      extract.mockResolvedValueOnce(true);
      await expect(importNetcanvas(mockProtocolPath))
        .resolves.toEqual('/dev/null/get/electron/path/architect/protocols/809895df-bbd7-4c76-ac58-e6ada2625f9b');
    });
  });


  describe('verifyNetcanvas(filePath)', () => {
    beforeEach(() => {
      pruneProtocol.mockImplementation(p => Promise.resolve(p));
    });

    it('Rejects with a human readable error when verification fails', async () => {
      fse.access.mockResolvedValue(true);
      extract.mockResolvedValue(true);
      fse.readJson.mockResolvedValue({ schemaVersion: 4 });

      await expect(verifyNetcanvas(mockProtocolPath, {}))
        .rejects.toMatchObject({ friendlyCode: errors.VerificationFailed });
    });

    it('Resolves to filePath if validation passes', async () => {
      fse.access.mockResolvedValue(true);
      extract.mockResolvedValue(true);
      fse.readJson.mockResolvedValue({ schemaVersion: 4 });

      await expect(verifyNetcanvas(mockProtocolPath, { schemaVersion: 4 }))
        .resolves.toEqual(mockProtocolPath);
    });
  });
});
