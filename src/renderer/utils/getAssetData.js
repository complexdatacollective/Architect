import fs from 'fs-extra';
import { memoize } from 'lodash';

const resolver = (sourcePath) => sourcePath;

const getAssetData = (sourcePath, type) => {
  switch (type) {
    default:
      return new Promise((resolve, reject) => {
        fs.readFile(sourcePath, 'utf8', (error, data) => {
          if (error) { reject(error); return; }

          resolve(JSON.parse(data));
        });
      });
  }
};

export default memoize(getAssetData, resolver);
