import { fileSystem } from '~/app/api';
import { memoize } from 'lodash';

const resolver = (sourcePath) => sourcePath;

const getAssetData = async (sourcePath, type) => {
  switch (type) {
    default:
      try {
        const data = await fileSystem.readFile(sourcePath, 'utf8');
        return JSON.parse(data);
      } catch (error) {
        throw error;
      }
  }
};

export default memoize(getAssetData, resolver);
