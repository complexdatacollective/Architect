import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Section } from '@components/EditorLayout';
import useExternalDataPreview from '@components/AssetBrowser/useExternalDataPreview';
import useExternalDataDownload from '@components/AssetBrowser/useExternalDataDownload';
import Assets from './Assets';
import NewAsset from './NewAsset';
import withAssetActions from './withAssetActions';

const AssetBrowser = ({
  type,
  selected,
  onSelect,
  onDelete,
  disableDelete,
}) => {
  const handleCreate = useCallback((assetIds) => {
    if (assetIds.length !== 1) { return; } // if multiple files were uploaded
    if (!assetIds[0]) { return; } // if a single invalid file was uploaded
    onSelect(assetIds[0]);
  }, [onSelect]);

  const [preview, handleShowPreview] = useExternalDataPreview();
  const handleDownload = useExternalDataDownload();

  return (
    <>
      <Section title="Import a New Resource">
        <NewAsset
          onCreate={handleCreate}
          type={type}
        />
      </Section>
      <Section
        title="Resource Library"
      >
        <Assets
          onSelect={onSelect}
          onPreview={handleShowPreview}
          onDownload={handleDownload}
          onDelete={onDelete}
          disableDelete={disableDelete}
          selected={selected}
          type={type}
        />
      </Section>
      { preview }
    </>
  );
};

AssetBrowser.propTypes = {
  type: PropTypes.string,
  selected: PropTypes.string,
  onSelect: PropTypes.func,
  onDelete: PropTypes.func,
  disableDelete: PropTypes.bool,
};

AssetBrowser.defaultProps = {
  type: null,
  selected: null,
  onSelect: () => {},
  onDelete: () => {},
  disableDelete: false,
};

export default compose(
  withAssetActions,
)(AssetBrowser);
