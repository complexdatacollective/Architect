/* eslint-env jest */

import fse from 'fs-extra';
import path from 'path';
import { extract, archive } from '@app/utils/protocols/lib/archive';
import pruneProtocolAssets from '@app/utils/pruneProtocolAssets';
import { pruneProtocol } from '@app/utils/prune';
import {
  // checkSchemaVersion,
  // createNetcanvas,
  errors,
  importNetcanvas,
  // migrateNetcanvas,
  readProtocol,
  saveNetcanvas,
  // schemaVersionStates,
  utils,
  // validateNetcanvas,
} from '../netcanvasFile';

jest.mock('fs-extra');
jest.mock('@app/utils/protocols/lib/archive');
jest.mock('@app/utils/pruneProtocolAssets');
jest.mock('@app/utils/prune');

const {
  // commitNetcanvas,
  createNetcanvasExport,
  deployNetcanvas,
  // revertNetcanvas,
  verifyNetcanvas,
  // writeProtocol,
} = utils;

const mockProtocolPath = path.join(__dirname, '..', '..', 'network-canvas', 'integration-tests', 'data', 'mock.netcanvas');
const mockProtocol = { description: 'test protocol' };

const mockAndLog = (targets) => {
  const logger = jest.fn();

  Object.keys(targets).forEach((name) => {
    const [target, result] = targets[name];
    let count = 0;
    target.mockImplementation((...args) => {
      logger(name, args);
      count += 1;
      return result.length ? result[count] : result;
    });
  });

  return logger;
};

describe('utils/netcanvasFile', () => {
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
  });

  it.todo('errors');
  it.todo('schemaVersionStates');

  it.todo('createNetcanvas()');
  it.todo('migrateNetcanvas()');
  it.todo('commitNetcanvas()');
  it.todo('revertNetcanvas()');
  it.todo('writeProtocol()');

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

      await saveNetcanvas('/dev/null/working/path', mockProtocol, '/dev/null/destination/path');

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

  describe('readProtocol(protocolPath)', () => {
    it('Rejects with a human readable error when protocol cannot be parsed', async () => {
      fse.readJson.mockImplementation(() =>
        new Promise((resolve, reject) => {
          try {
            JSON.parse('malformatted json');
          } catch (e) {
            return reject(e);
          }

          return resolve();
        }),
      );

      await expect(
        readProtocol('/var/null/'),
      ).rejects.toMatchObject({ friendlyCode: errors.ReadError });
    });

    it('Resolves to protocol', async () => {
      fse.readJson.mockResolvedValueOnce({});

      await expect(
        readProtocol('/var/null/'),
      ).resolves.toEqual({});
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

  describe('deployNetcanvas(exportPath, destinationPath)', () => {
    const netcanvasFilePath = '/dev/null/get/electron/path/architect/exports/pendingExport';
    const userDestinationPath = '/dev/null/user/path/export/destination';

    it('does not create a backup if destination does not already exist', async () => {
      fse.rename.mockResolvedValueOnce(true);
      fse.pathExists.mockResolvedValueOnce(false);

      const result = await deployNetcanvas(
        netcanvasFilePath,
        userDestinationPath,
      );

      expect(fse.rename.mock.calls.length).toBe(1);
      expect(fse.rename.mock.calls[0]).toEqual([
        '/dev/null/get/electron/path/architect/exports/pendingExport',
        '/dev/null/user/path/export/destination',
      ]);

      expect(result).toEqual({
        backupPath: null,
        savePath: userDestinationPath,
      });
    });

    it('creates a backup if destination does exist', async () => {
      fse.rename.mockResolvedValue(true);
      fse.pathExists.mockResolvedValue(true);

      const result = await deployNetcanvas(
        netcanvasFilePath,
        userDestinationPath,
      );

      expect(fse.rename.mock.calls.length).toBe(2);
      expect(fse.rename.mock.calls[0]).toEqual([
        '/dev/null/user/path/export/destination',
        expect.stringMatching(/\/dev\/null\/user\/path\/export\/destination\.backup-[0-9]+/),
      ]);
      expect(fse.rename.mock.calls[1]).toEqual([
        '/dev/null/get/electron/path/architect/exports/pendingExport',
        '/dev/null/user/path/export/destination',
      ]);

      expect(result).toEqual({
        backupPath: expect.stringMatching(/\/dev\/null\/user\/path\/export\/destination\.backup-[0-9]+/),
        savePath: userDestinationPath,
      });
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
