/* eslint-env jest */

import fse from 'fs-extra';
import path from 'path';
import { extract, archive } from '@app/utils/protocols/lib/archive';
import pruneAssets from '@app/utils/protocols/pruneAssets';
import {
  errors,
  importNetcanvas,
  exportNetcanvas,
} from '../file';

jest.mock('fs-extra');
jest.mock('@app/utils/protocols/lib/archive');
jest.mock('@app/utils/protocols/pruneAssets');

const mockProtocol = path.join(__dirname, '..', '..', 'network-canvas', 'integration-tests', 'data', 'mock.netcanvas');

describe('utils/file', () => {
  describe('importNetcanvas(filePath)', () => {
    it('rejects with a readable error when permissions are wrong', async () => {
      fse.access.mockRejectedValueOnce(new Error());

      await expect(() => importNetcanvas(mockProtocol))
        .rejects.toThrow(errors.MissingPermissions);
    });

    it('rejects with a readable error when it cannot extract a protocol', async () => {
      extract.mockRejectedValueOnce(new Error());

      await expect(importNetcanvas(mockProtocol))
        .rejects.toThrow(errors.ExtractFailed);
    });

    it('resolves to a uuid path in temp', async () => {
      fse.access.mockResolvedValueOnce(true);
      extract.mockResolvedValueOnce(true);
      await expect(importNetcanvas(mockProtocol))
        .resolves.toEqual('/dev/null/get/electron/path/protocols/809895df-bbd7-4c76-ac58-e6ada2625f9b');
    });
  });

  describe('exportNetcanvas(workingPath, protocol)', () => {
    it('rejects with a readable error when protocol cannot be saved', async () => {
      const circularProtocol = {};
      circularProtocol.a = { b: circularProtocol };

      await expect(() => exportNetcanvas(path.join('/dev/null'), circularProtocol))
        .rejects.toThrow(errors.SaveFailed);

      fse.writeFile.mockRejectedValueOnce(new Error());

      await expect(() => exportNetcanvas(path.join('/dev/null'), {}))
        .rejects.toThrow(errors.SaveFailed);
    });

    it('rejects with a readable error when asset pruning fails', async () => {
      fse.writeFile.mockResolvedValueOnce(true);
      pruneAssets.mockRejectedValueOnce(new Error());

      await expect(exportNetcanvas(path.join('/dev/null'), {}))
        .rejects.toThrow(errors.PruneFailed);
    });

    it('rejects with a readable error when archive fails', async () => {
      fse.writeFile.mockResolvedValueOnce(true);
      pruneAssets.mockResolvedValueOnce(true);
      archive.mockRejectedValueOnce(new Error());

      await expect(exportNetcanvas(path.join('/dev/null'), {}))
        .rejects.toThrow(errors.ArchiveFailed);
    });

    it.todo('resolves to a uuid path in temp');
  });
});


//
