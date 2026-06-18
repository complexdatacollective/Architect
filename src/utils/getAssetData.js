import { electronAPI } from '@utils/electronBridge';
import { memoize } from 'lodash';

const resolver = (sourcePath) => sourcePath;

const getAssetData = async (sourcePath) => {
  const data = await electronAPI.fs.readFile(sourcePath, 'utf8');
  return JSON.parse(data);
};

export default memoize(getAssetData, resolver);
