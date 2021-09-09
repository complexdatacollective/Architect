import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { get } from 'lodash';
import fse from 'fs-extra';
import path from 'path';
import { remote } from 'electron';
import { getWorkingPath } from '@selectors/session';
import { getAssetManifest } from '@selectors/protocol';

const defaultMeta = {
  name: 'Interview network',
};

const useExternalDataDownload = () => {
  const assetManifest = useSelector(getAssetManifest);
  const workingPath = useSelector(getWorkingPath);

  const getAssetInfo = useCallback(
    (id) => {
      const source = get(assetManifest, [id, 'source'], '');
      const meta = get(assetManifest, id, defaultMeta);
      const assetPath = path.join(workingPath, 'assets', path.basename(source));
      return [assetPath, meta];
    },
    [assetManifest, workingPath],
  );

  const handleDownload = useCallback(
    (id) => {
      const [assetPath, meta] = getAssetInfo(id);
      remote.dialog.showSaveDialog(
        {
          buttonLabel: 'Save Asset',
          nameFieldLabel: 'Save As:',
          properties: ['saveFile'],
          defaultPath: meta.source,
        },
        remote.getCurrentWindow(),
      )
        .then(({ canceled, filePath }) => {
          if (canceled) { return; }
          fse.copy(assetPath, filePath);
        });
    },
    [],
  );

  return handleDownload;
};

export default useExternalDataDownload;
