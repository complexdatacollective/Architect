/* eslint-env jest */
import Zip from 'jszip';
import fs from 'fs';
import exporter, { createPackage, saveToDisk } from '../exportProtocol';

jest.mock('fs');

const mockProtocol = {
  variableRegistry: {},
  assetRegistry: [],
  stages: [],
};

describe('exporter module', () => {
  describe('createPackage(protocol)', () => {
    it('returns a promise',
      () => createPackage(mockProtocol),
    );

    it('the promise resolves to a zip blob containing the protocol contents', (done) => {
      createPackage(mockProtocol).then((zippedPackage) => {
        new Zip()
          .loadAsync(zippedPackage)
          .then((zip) => {
            zip.file('protocol.json').async('string').then((text) => {
              expect(JSON.parse(text)).toEqual(mockProtocol);
              done();
            });
          });
      });
    });
  });

  describe('saveToDisk(content)', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('returns a promise',
      () => saveToDisk(new Zip().generateAsync({ type: 'blob' })),
    );

    it('writeFile is called with filename and content', (done) => {
      new Zip().generateAsync({ type: 'blob' }).then(zip =>
        saveToDisk(zip)
          .then(() => {
            const [filename, content] = fs.writeFile.mock.calls[0];
            expect(filename).toEqual('filename.canvas');
            expect(content instanceof Blob).toBeTruthy();
            expect(content.type).toEqual('application/zip');
            done();
          }),
      );
    });
  });

  describe('exporter(protocol)', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('returns a promise',
      () => exporter(mockProtocol),
    );

    it('writeFile is called with filename and content', (done) => {
      new Zip().generateAsync({ type: 'blob' }).then(zip =>
        saveToDisk(zip)
          .then(() => {
            const [filename, content] = fs.writeFile.mock.calls[0];
            expect(filename).toEqual('filename.canvas');
            expect(content instanceof Blob).toBeTruthy();
            expect(content.type).toEqual('application/zip');
            done();
          }),
      );
    });
  });
});
