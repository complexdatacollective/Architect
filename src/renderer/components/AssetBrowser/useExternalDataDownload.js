import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { get } from 'lodash';
import { fileSystem, path, dialog } from '~/app/api';
import { getWorkingPath } from '~/selectors/session';
import { getAssetManifest } from '~/selectors/protocol';

const defaultMeta = {
  name: 'Interview network',
};

const useExternalDataDownload = () => {
  const assetManifest = useSelector(getAssetManifest);
  const workingPath = useSelector(getWorkingPath);

  const getAssetInfo = useCallback(
    async (id) => {
      const source = get(assetManifest, [id, 'source'], '');
      const meta = get(assetManifest, id, defaultMeta);
      const assetPath = await path.join(workingPath, 'assets', await path.basename(source));
      return [assetPath, meta];
    },
    [assetManifest, workingPath],
  );

  const handleDownload = useCallback(
    async (id) => {
      const [assetPath, meta] = await getAssetInfo(id);
      const result = await dialog.showSaveDialog({
        buttonLabel: 'Save Asset',
        nameFieldLabel: 'Save As:',
        properties: ['saveFile'],
        defaultPath: meta.source,
      });
      
      if (!result.canceled && result.filePath) {
        await fileSystem.copy(assetPath, result.filePath);
      }
    },
    [getAssetInfo],
  );

  return handleDownload;
};

export default useExternalDataDownload;
