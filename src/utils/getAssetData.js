import { memoize } from 'lodash';
import { electronAPI } from '@utils/electronBridge';

const resolver = (sourcePath) => sourcePath;

const getAssetData = async (sourcePath) => {
  const data = await electronAPI.fs.readFile(sourcePath, 'utf8');
  return JSON.parse(data);
};

export default memoize(getAssetData, resolver);
