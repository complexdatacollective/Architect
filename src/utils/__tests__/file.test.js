/* eslint-env jest */

import fse from 'fs-extra';
import path from 'path';
import { extract, archive } from '@app/utils/protocols/lib/archive';
import pruneAssets from '@app/utils/protocols/pruneAssets';
import validateProtocol from '@app/utils/validateProtocol';
import {
  errors,
  createNetcanvasImport,
  createNetcanvasExport,
  deployNetcanvasExport,
  readProtocol,
  verifyNetcanvas,
} from '../file';

jest.mock('fs-extra');
jest.mock('@app/utils/protocols/lib/archive');
jest.mock('@app/utils/protocols/pruneAssets');
jest.mock('@app/utils/validateProtocol');

const mockProtocol = path.join(__dirname, '..', '..', 'network-canvas', 'integration-tests', 'data', 'mock.netcanvas');

describe('utils/file', () => {
  describe('createNetcanvasImport(filePath)', () => {
    it('rejects with a readable error when permissions are wrong', async () => {
      fse.access.mockRejectedValueOnce(new Error());

      await expect(() => createNetcanvasImport(mockProtocol))
        .rejects.toThrow(errors.MissingPermissions);
    });

    it('rejects with a readable error when it cannot extract a protocol', async () => {
      extract.mockRejectedValueOnce(new Error());

      await expect(createNetcanvasImport(mockProtocol))
        .rejects.toThrow(errors.ExtractFailed);
    });

    it('resolves to a uuid path in temp', async () => {
      fse.access.mockResolvedValueOnce(true);
      extract.mockResolvedValueOnce(true);
      await expect(createNetcanvasImport(mockProtocol))
        .resolves.toEqual('/dev/null/get/electron/path/architect/protocols/809895df-bbd7-4c76-ac58-e6ada2625f9b');
    });
  });

  describe('createNetcanvasExport(workingPath, protocol)', () => {
    const workingPath = path.join('dev', 'null');
    const circularProtocol = {};
    circularProtocol.a = { b: circularProtocol };

    it('rejects with a readable error when protocol cannot be saved', async () => {
      await expect(() => createNetcanvasExport(workingPath, circularProtocol))
        .rejects.toThrow(errors.SaveFailed);

      fse.writeFile.mockRejectedValueOnce(new Error());

      await expect(() => createNetcanvasExport(workingPath, {}))
        .rejects.toThrow(errors.SaveFailed);
    });

    it('rejects with a readable error when asset pruning fails', async () => {
      fse.writeFile.mockResolvedValueOnce(true);
      pruneAssets.mockRejectedValueOnce(new Error());

      await expect(createNetcanvasExport(workingPath, {}))
        .rejects.toThrow(errors.PruneFailed);
    });

    it('rejects with a readable error when archive fails', async () => {
      fse.writeFile.mockResolvedValueOnce(true);
      pruneAssets.mockResolvedValueOnce(true);
      archive.mockRejectedValueOnce(new Error());

      await expect(createNetcanvasExport(workingPath, {}))
        .rejects.toThrow(errors.ArchiveFailed);
    });

    it('resolves to a uuid path in temp', async () => {
      fse.writeFile.mockResolvedValueOnce(true);
      pruneAssets.mockResolvedValueOnce(true);
      archive.mockResolvedValueOnce(true);

      await expect(createNetcanvasExport(workingPath, {}))
        .resolves.toEqual('/dev/null/get/electron/path/architect/exports/809895df-bbd7-4c76-ac58-e6ada2625f9b');
    });
  });

  describe('deployNetcanvasExport(exportPath, destinationPath)', () => {
    const netcanvasFilePath = '/dev/null/get/electron/path/architect/exports/pendingExport';
    const userDestinationPath = '/dev/null/user/path/export/destination';

    it('reject with a readable error if cannot be backed up', async () => {
      fse.rename.mockReset();
      fse.rename.mockRejectedValueOnce(new Error());
      fse.rename.mockResolvedValueOnce(true);
      await expect(deployNetcanvasExport(
        netcanvasFilePath,
        userDestinationPath,
      )).rejects.toThrow(errors.BackupFailed);
    });
    it('reject with a readable error if cannot be substituted', async () => {
      fse.rename.mockReset();
      fse.rename.mockResolvedValueOnce(true);
      fse.rename.mockRejectedValueOnce(new Error());

      await expect(deployNetcanvasExport(
        netcanvasFilePath,
        userDestinationPath,
      )).rejects.toThrow(errors.SaveFailed);
    });
    it('resolves to { savePath, backupPath }', async () => {
      fse.rename.mockReset();
      fse.rename.mockResolvedValue(true);
      const result = await deployNetcanvasExport(
        netcanvasFilePath,
        userDestinationPath,
      );
      expect(result).toEqual({
        backupPath: expect.stringMatching(/\/dev\/null\/user\/path\/export\/destination\.backup-[0-9]+/),
        savePath: userDestinationPath,
      });
    });
  });

  describe('readProtocol(protocolPath)', () => {
    it('Rejects with a human readable error when protocol cannot be read', async () => {
      fse.readJson.mockReset();
      fse.readJson.mockImplementation(() => {
        const e = new Error();
        e.code = 'ENOENT';

        return Promise.reject(e);
      });

      await expect(
        readProtocol('/non/existing/path'),
      ).rejects.toThrow(errors.MissingProtocolJson);
    });

    it('Rejects with a human readable error when protocol cannot be parsed', async () => {
      fse.readJson.mockReset();
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
      ).rejects.toThrow(errors.ProtocolJsonParseError);
    });

    it('Resolves to protocol', async () => {
      fse.readJson.mockReset();
      fse.readJson.mockResolvedValueOnce({});

      await expect(
        readProtocol('/var/null/'),
      ).resolves.toEqual({});
    });
  });

  describe('verifyNetcanvas(filePath)', () => {
    beforeEach(() => {
      fse.access.mockReset();
      fse.readJson.mockReset();
      extract.mockReset();
      validateProtocol.mockReset();
    });

    it('Rejects with a human readable error when netcanvas cannot be validated', async () => {
      fse.access.mockResolvedValueOnce(true);
      fse.readJson.mockRejectedValueOnce(new Error());

      await expect(verifyNetcanvas(mockProtocol))
        .rejects.toThrow(errors.NetcanvasCouldNotValidate);
    });

    it('Rejects with a human readable error when validation fails', async () => {
      fse.access.mockResolvedValueOnce(true);
      extract.mockResolvedValueOnce(true);
      fse.readJson.mockResolvedValueOnce({});
      validateProtocol.mockRejectedValueOnce(new Error());

      await expect(verifyNetcanvas(mockProtocol))
        .rejects.toThrow(errors.NetcanvasValidationError);
    });

    it('Resolves to true if validation passes', async () => {
      fse.access.mockResolvedValueOnce(true);
      extract.mockResolvedValueOnce(true);
      fse.readJson.mockResolvedValueOnce({});
      validateProtocol.mockResolvedValueOnce(true);

      await expect(verifyNetcanvas(mockProtocol))
        .resolves.toEqual(true);
    });
  });
});


//
