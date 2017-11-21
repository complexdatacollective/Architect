/* eslint-env jest */

import Zip from 'jszip';
import exporter, { createPackage, saveToDisk } from '../exporter';

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
    it('returns a promise');
  });

  describe('exporter(protocol)', () => {
    it('returns a promise');
  });
});
