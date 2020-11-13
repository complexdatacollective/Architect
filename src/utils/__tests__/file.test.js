/* eslint-env jest */

import fse from 'fs-extra';
import path from 'path';
import { extract } from '@app/utils/protocols/lib/archive';
import {
  errors,
  importNetcanvas,
} from '../file';

jest.mock('fs-extra');
jest.mock('@app/utils/protocols/lib/archive');

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
    it.todo('rejects with a readable error when protocol cannot be stringified');
    it.todo('rejects with a readable error when protocol cannot be written to working copy');
    it.todo('rejects with a readable error when asset pruning fails');
    it.todo('rejects with a readable error when archive fails');
    it.todo('resolves to a uuid path in temp');
  });
});


//
