import log from '@utils/logger';
import { electronAPI, pathSync } from '@utils/electronBridge';

const contains = (protocol, string) => protocol.indexOf(string) !== -1;

const isInTempPath = async (filePath) => {
  const tempPath = await electronAPI.app.getPath('temp');
  const normalizedPath = await electronAPI.path.normalize(filePath);
  return normalizedPath.indexOf(tempPath) === 0;
};

const removeFile = async (filePath) => {
  // Check we haven't somehow ended up outside of temppath since we are deleting things
  const inTempPath = await isInTempPath(filePath);
  if (!inTempPath) {
    const tempPath = await electronAPI.app.getPath('temp');
    throw new Error(`File ${filePath}) could not be removed because it is outside of the temporary folder (${tempPath})`);
  }

  await electronAPI.fs.unlink(filePath);
};

/**
 * Remove unused protocol assets
 * @param {string} workingPath - The working directory of the protocol to prune
 */
const pruneAssets = async (workingPath) => {
  const protocolPath = pathSync.join(workingPath, 'protocol.json');
  const protocolAssetsPath = pathSync.join(workingPath, 'assets');

  try {
    const [protocolFile, files] = await Promise.all([
      electronAPI.fs.readFile(protocolPath, 'utf8'),
      electronAPI.fs.readdir(protocolAssetsPath),
    ]);

    // Find files to remove (not referenced in protocol)
    const filesToRemove = files
      .filter((fileName) => !contains(protocolFile, fileName))
      .map((fileName) => pathSync.join(workingPath, 'assets', fileName));

    // Remove files in parallel
    await Promise.all(filesToRemove.map((filePath) => removeFile(filePath)));
  } catch (e) {
    // Log error but don't throw - pruning is non-critical
    log.error('Error pruning assets:', e);
  }
};

export default pruneAssets;
