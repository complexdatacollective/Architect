import React, { useState, useCallback, useMemo } from 'react';
import fse from 'fs-extra';
import { remote } from 'electron';
import Preview from '@components/AssetBrowser/Preview';

const useExternalDataPreview = () => {
  const [showPreview, setShowPreview] = useState(null);

  const handleShowPreview = setShowPreview;

  const handleClosePreview = useCallback(
    () => setShowPreview(null),
    [setShowPreview],
  );

  const handleDownload = useCallback(
    (assetPath, meta) => {
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

  const preview = useMemo(
    () => (
      showPreview && (
        <Preview
          id={showPreview}
          onDownload={handleDownload}
          onClose={handleClosePreview}
        />
      )
    ),
    [showPreview],
  );

  return [preview, handleShowPreview, handleClosePreview, handleDownload];
};

export default useExternalDataPreview;
