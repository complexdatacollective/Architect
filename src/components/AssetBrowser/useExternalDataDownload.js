import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { get } from 'lodash';
import { electronAPI } from '@utils/electronBridge';
import { getWorkingPath } from '@selectors/session';
import { getAssetManifest } from '@selectors/protocol';

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
      const baseName = await electronAPI.path.basename(source);
      const assetPath = await electronAPI.path.join(workingPath, 'assets', baseName);
      return [assetPath, meta];
    },
    [assetManifest, workingPath],
  );

  const handleDownload = useCallback(
    async (id) => {
      const [assetPath, meta] = await getAssetInfo(id);
      const { canceled, filePath } = await electronAPI.dialog.showSaveDialog({
        buttonLabel: 'Save Asset',
        nameFieldLabel: 'Save As:',
        properties: ['saveFile'],
        defaultPath: meta.source,
      });

      if (canceled) { return; }
      await electronAPI.fs.copy(assetPath, filePath);
    },
    [getAssetInfo],
  );

  return handleDownload;
};

export default useExternalDataDownload;
