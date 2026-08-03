import Preview from '@components/AssetBrowser/Preview';
import { useCallback, useMemo, useState } from 'react';

import useExternalDataDownload from './useExternalDataDownload';

const useExternalDataPreview = () => {
  const [showPreview, setShowPreview] = useState(null);
  const handleDownload = useExternalDataDownload();

  const handleShowPreview = setShowPreview;

  const handleClosePreview = useCallback(
    () => setShowPreview(null),
    [setShowPreview],
  );

  const preview = useMemo(
    () =>
      showPreview && (
        <Preview
          id={showPreview}
          onDownload={() => handleDownload(showPreview)}
          onClose={handleClosePreview}
        />
      ),
    [showPreview],
  );

  return [preview, handleShowPreview, handleClosePreview];
};

export default useExternalDataPreview;
