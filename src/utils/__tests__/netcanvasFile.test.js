/* eslint-env jest */

import fse from 'fs-extra';
import path from 'path';
import { extract, archive } from '@app/utils/protocols/lib/archive';
import pruneProtocolAssets from '@app/utils/pruneProtocolAssets';
import pruneProtocol from '@app/utils/pruneProtocol';
import {
  errors,
  importNetcanvas,
  createNetcanvasExport,
  deployNetcanvas,
  readProtocol,
  verifyNetcanvas,
} from '../netcanvasFile';

jest.mock('fs-extra');
jest.mock('@app/utils/protocols/lib/archive');
jest.mock('@app/utils/pruneProtocolAssets');
jest.mock('@app/utils/pruneProtocol');

const mockProtocol = path.join(__dirname, '..', '..', 'network-canvas', 'integration-tests', 'data', 'mock.netcanvas');

describe('utils/netcanvasFile', () => {
  beforeEach(() => {
    archive.mockReset();
    extract.mockReset();
    fse.access.mockReset();
    fse.readJson.mockReset();
    fse.rename.mockReset();
    fse.writeFile.mockReset();
    fse.writeJson.mockReset();
    pruneProtocol.mockReset();
    pruneProtocolAssets.mockReset();
  });

  describe('readProtocol(protocolPath)', () => {
    it('Rejects with a human readable error when protocol cannot be read', async () => {
      fse.readJson.mockImplementation(() => {
        const e = new Error();
        e.code = 'ENOENT';

        return Promise.reject(e);
      });

      await expect(
        readProtocol('/non/existing/path'),
      ).rejects.toThrowError(errors.MissingProtocolJson);
    });

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
      ).rejects.toThrowError(errors.ProtocolJsonParseError);
    });

    it('Resolves to protocol', async () => {
      fse.readJson.mockResolvedValueOnce({});

      await expect(
        readProtocol('/var/null/'),
      ).resolves.toEqual({});
    });
  });

  it.todo('writeProtocol()');
  it.todo('preflight()');

  describe('createNetcanvasExport(workingPath, protocol)', () => {
    const workingPath = path.join('dev', 'null');
    const circularProtocol = {};
    circularProtocol.a = { b: circularProtocol };

    it('rejects with a readable error when protocol cannot be saved', async () => {
      await expect(() => createNetcanvasExport(workingPath, circularProtocol))
        .rejects.toThrowError(errors.SaveFailed);

      fse.writeFile.mockRejectedValueOnce(new Error());

      await expect(() => createNetcanvasExport(workingPath, {}))
        .rejects.toThrowError(errors.SaveFailed);
    });

    it('rejects with a readable error when archive fails', async () => {
      fse.writeJson.mockResolvedValue(true);
      fse.readJson.mockResolvedValueOnce({});
      pruneProtocolAssets.mockResolvedValueOnce(true);
      pruneProtocol.mockReturnValueOnce({});
      archive.mockRejectedValueOnce(new Error());

      await expect(createNetcanvasExport(workingPath, {}))
        .rejects.toThrowError(errors.ArchiveFailed);
    });

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
      fse.access.mockRejectedValueOnce(new Error());

      await expect(() => importNetcanvas(mockProtocol))
        .rejects.toThrowError(errors.MissingPermissions);
    });

    it('rejects with a readable error when it cannot extract a protocol', async () => {
      fse.access.mockResolvedValueOnce(true);
      extract.mockRejectedValueOnce(new Error());

      await expect(importNetcanvas(mockProtocol))
        .rejects.toThrowError(errors.ExtractFailed);
    });

    it('resolves to a uuid path in temp', async () => {
      fse.access.mockResolvedValueOnce(true);
      extract.mockResolvedValueOnce(true);
      await expect(importNetcanvas(mockProtocol))
        .resolves.toEqual('/dev/null/get/electron/path/architect/protocols/809895df-bbd7-4c76-ac58-e6ada2625f9b');
    });
  });

  describe('deployNetcanvas(exportPath, destinationPath, createBackup = true)', () => {
    const netcanvasFilePath = '/dev/null/get/electron/path/architect/exports/pendingExport';
    const userDestinationPath = '/dev/null/user/path/export/destination';

    it('rejects with a readable error if cannot be backed up', async () => {
      fse.access.mockResolvedValueOnce(true);
      fse.rename.mockRejectedValueOnce(new Error());
      fse.rename.mockResolvedValueOnce(true);
      await expect(deployNetcanvas(
        netcanvasFilePath,
        userDestinationPath,
      )).rejects.toThrowError(errors.BackupFailed);
    });

    it('rejects with a readable error if cannot be substituted', async () => {
      fse.access.mockRejectedValueOnce(new Error());
      fse.rename.mockRejectedValueOnce(new Error());

      await expect(deployNetcanvas(
        netcanvasFilePath,
        userDestinationPath,
      )).rejects.toThrowError(errors.SaveFailed);
    });

    it('does not create a backup if destination does not already exist', async () => {
      fse.rename.mockResolvedValueOnce(true);
      fse.access.mockRejectedValueOnce(new Error());

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
      fse.access.mockResolvedValue(true);

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

    it('does not create a backup if specified not to', async () => {
      fse.rename.mockResolvedValue(true);
      fse.access.mockResolvedValue(true);

      const result = await deployNetcanvas(
        netcanvasFilePath,
        userDestinationPath,
        false,
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
  });

  it.todo('createNetcanvas()');

  it.todo('checkSchemaVersion()');

  describe('verifyNetcanvas(filePath)', () => {
    it('Rejects with a human readable error when netcanvas cannot be verified', async () => {
      fse.access.mockResolvedValue(true);
      fse.readJson.mockRejectedValue(new Error());

      await expect(verifyNetcanvas(mockProtocol))
        .rejects.toThrowError(errors.NetcanvasCouldNotValidate);
    });

    it('Rejects with a human readable error when verification fails', async () => {
      fse.access.mockResolvedValue(true);
      extract.mockResolvedValue(true);
      fse.readJson.mockResolvedValue({ schemaVersion: 4 });

      await expect(verifyNetcanvas(mockProtocol, {}))
        .rejects.toThrowError(errors.NetcanvasVerificationError);
    });

    it('Resolves to filePath if validation passes', async () => {
      fse.access.mockResolvedValue(true);
      extract.mockResolvedValue(true);
      fse.readJson.mockResolvedValue({ schemaVersion: 4 });

      await expect(verifyNetcanvas(mockProtocol, { schemaVersion: 4 }))
        .resolves.toEqual(mockProtocol);
    });
  });

  describe('saveNetcanvas(workingPath, protocol, filePath, createBackup = true)', () => {
    it.todo('Does not create a backup if specified not to');
    it.todo('Resolves to { savePath, backupPath }');
  });


  it.todo('migrateNetcanvas()');
});
