/* eslint-env jest */

import fse from 'fs-extra';
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

jest.mock('fs-extra');
jest.mock('@app/utils/protocols/lib/archive');
jest.mock('@codaco/protocol-validation');
jest.mock('@app/utils/pruneProtocolAssets');
jest.mock('@app/utils/prune');

describe('netcanvasFile/lib', () => {
  beforeEach(() => {
    fse.access.mockReset();
    fse.pathExists.mockReset();
    fse.readJson.mockReset();
    fse.rename.mockReset();
    fse.writeFile.mockReset();
    fse.writeJson.mockReset();
    fse.unlink.mockReset();
    fse.access.mockReset();
    fse.mkdirp.mockReset();
    fse.stat.mockReset();

    fse.writeJson.mockResolvedValue();
    fse.stat.mockImplementation(() => Promise.resolve(({
      isFile: jest.fn(() => false),
    })));
    fse.mkdirp.mockResolvedValue();
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
      fse.stat.mockImplementation(() => Promise.resolve(({
        isFile: jest.fn(() => true),
      })));

      fse.unlink.mockResolvedValue();

      await expect(
        commitNetcanvas({
          savePath: '/dev/null/user/save/path',
          backupPath: '/dev/null/user/save/path.backup',
        }),
      )
        .resolves.toEqual('/dev/null/user/save/path');

      expect(fse.unlink.mock.calls).toEqual([['/dev/null/user/save/path.backup']]);
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
      fse.stat.mockImplementation(() => Promise.resolve(({
        isFile: jest.fn(() => true),
      })));

      fse.unlink.mockResolvedValue();

      await expect(
        revertNetcanvas({
          savePath: '/dev/null/user/save/path',
          backupPath: '/dev/null/user/save/path.backup',
        }),
      )
        .resolves.toEqual('/dev/null/user/save/path');

      expect(fse.unlink.mock.calls).toEqual([['/dev/null/user/save/path']]);
      expect(fse.rename.mock.calls).toEqual([[
        '/dev/null/user/save/path.backup',
        '/dev/null/user/save/path',
      ]]);
    });
  });

  describe('writeProtocol(workingPath, protocol)', () => {
    it('rejects to a write error if write fails', async () => {
      fse.writeJson.mockRejectedValue(new Error('oh no'));

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
      fse.readJson.mockImplementation(() => new Promise((resolve, reject) => {
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
      fse.readJson.mockResolvedValueOnce({});

      await expect(
        readProtocol('/var/null/'),
      ).resolves.toEqual({});
    });
  });

  describe('deployNetcanvas(exportPath, destinationPath)', () => {
    const netcanvasFilePath = '/dev/null/get/electron/path/architect/exports/pendingExport';
    const userDestinationPath = '/dev/null/user/path/export/destination';

    it('does not create a backup if destination does not already exist', async () => {
      fse.rename.mockResolvedValueOnce(true);
      fse.pathExists.mockResolvedValueOnce(false);
      fse.copy.mockResolvedValueOnce(true);

      const result = await deployNetcanvas(
        netcanvasFilePath,
        userDestinationPath,
      );

      expect(fse.rename.mock.calls.length).toBe(0);
      expect(fse.copy.mock.calls[0]).toEqual([
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

      expect(fse.rename.mock.calls.length).toBe(1);
      expect(fse.rename.mock.calls[0]).toEqual([
        '/dev/null/user/path/export/destination',
        expect.stringMatching(/\/dev\/null\/user\/path\/export\/destination\.backup-[0-9]+/),
      ]);
      expect(fse.copy.mock.calls[0]).toEqual([
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
      fse.mkdirp.mockResolvedValue();
      pruneProtocol.mockImplementation((protocol) => Promise.resolve(protocol));
      fse.writeJson.mockResolvedValue();
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
      const accessError = new Error();
      accessError.code = 'EACCES';

      fse.access.mockRejectedValue(accessError);

      await expect(() => importNetcanvas(mockProtocolPath))
        .rejects.toMatchObject({ friendlyCode: errors.IncorrectPermissions });
    });

    it('rejects with a readable error when it cannot extract a protocol', async () => {
      extract.mockRejectedValue(new Error());
      fse.access.mockResolvedValue();

      await expect(importNetcanvas(mockProtocolPath))
        .rejects.toMatchObject({ friendlyCode: errors.OpenFailed });
    });

    it('resolves to a uuid path in temp', async () => {
      fse.access.mockResolvedValue();
      extract.mockResolvedValue();

      await expect(importNetcanvas(mockProtocolPath))
        .resolves.toEqual('/dev/null/get/electron/path/architect/protocols/809895df-bbd7-4c76-ac58-e6ada2625f9b');
    });
  });
});
