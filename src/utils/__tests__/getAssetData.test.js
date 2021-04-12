/* eslint-env jest */
import fs from 'fs-extra';
import getAssetData from '../getAssetData';

const mockData = {
  nodes: [],
  edges: [],
};

fs.readFile = jest.fn(
  (path, format, resolve) => resolve(null, JSON.stringify(mockData)),
);

describe('getAssetData', () => {
  it('can load a json network', (done) => {
    const source = '/dev/null/myMockSource.json';
    const type = 'network';

    getAssetData(source, type).then(
      (data) => {
        expect(data).toEqual(mockData);

        done();
      },
    );
  });

  it('it caches responses', (done) => {
    const source = '/dev/null/myMockSource.json';
    const type = 'network';

    Promise.all([
      getAssetData(source, type),
      getAssetData(source, type),
    ]).then(
      (results) => {
        const isSameObject = results.every(
          (result, index, all) => result === all[0],
        );

        expect(isSameObject).toBe(true);

        done();
      },
    );
  });
});
