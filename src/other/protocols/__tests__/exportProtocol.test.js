/* eslint-env jest */
import { createPackage } from '../exportProtocol';

jest.mock('fs');

const mockProtocolPath = '/tmp/my/protocol/path';

describe('exporter module', () => {
  describe('createPackage(protocol)', () => {
    it('returns a promise',
      () => createPackage(mockProtocolPath),
    );

    it('the promise resolves to a zip object containing the protocol contents', (done) => {
      createPackage(mockProtocolPath).then((zip) => {
        zip.file('protocol.json').async('string').then((text) => {
          expect(text).toEqual('mock file contents');
          done();
        });
      });
    });
  });
});
