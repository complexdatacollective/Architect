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
  });

  it.todo('errors');
  it.todo('createNetcanvas()');
  it.todo('migrateNetcanvas()');
  it.todo('schemaVersionStates');
  it.todo('commitNetcanvas()');
  it.todo('revertNetcanvas()');
  it.todo('writeProtocol()');

  describe('saveNetcanvas(workingPath, protocol, filePath)', () => {
    it.only('successful save', async () => {
      fse.readJson.mockResolvedValueOnce({});
      fse.writeJson.mockResolvedValue(true);
      pruneProtocolAssets.mockResolvedValueOnce(true);
      pruneProtocol.mockReturnValueOnce(mockProtocol);
      archive.mockResolvedValueOnce(true);
      fse.pathExists.mockResolvedValueOnce(true);
      fse.rename.mockResolvedValueOnce()
        .mockResolvedValueOnce();
      fse.stat.mockResolvedValueOnce({ isFile: () => Promise.resolve(true) });
      fse.unlink.mockResolvedValueOnce();
      fse.access.mockResolvedValueOnce();

      await saveNetcanvas('/dev/null/working/path', mockProtocol, '/dev/null/destination/path');

      expect(fse.writeJson.mock.calls[0])
        .toEqual(['/dev/null/working/path/protocol.json', mockProtocol, { spaces: 2 }]);
      expect(archive.mock.calls[0])
        .toEqual(['/dev/null/working/path', '/dev/null/get/electron/path/architect/exports/809895df-bbd7-4c76-ac58-e6ada2625f9b']);
      expect(fse.rename.mock.calls).toEqual([
        // rename original
        ['/dev/null/destination/path', expect.stringMatching(/\/dev\/null\/destination\/path\.backup-[0-9]+/)],
        // move new protocol to destination
        [archive.mock.calls[0][1], '/dev/null/destination/path'],
      ]);
      expect(fse.unlink.mock.calls[0]).toEqual([fse.rename.mock.calls[0][1]]);
    });
    it.todo('if export fails it reverts the file');
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
