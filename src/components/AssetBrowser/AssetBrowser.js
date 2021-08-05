import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Section } from '@components/EditorLayout';
import Assets from './Assets';
import NewAsset from './NewAsset';
import PreviewContents from './PreviewContents';
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

  const [showPreview, setShowPreview] = useState(null);

  const handleShowPreview = (id) => setShowPreview(id);

  const handleClosePreview = () => setShowPreview(null);

  const handleDownloadAsset = () => {};

  return (
    <>
      <Section>
        <NewAsset
          onCreate={handleCreate}
          type={type}
        />
      </Section>
      <Section>
        <h3>
          Resource library
          { type && (
          <span>
            (showing type:
            {type}
            )
          </span>
          )}
        </h3>
        <Assets
          onSelect={onSelect}
          onPreview={handleShowPreview}
          onDelete={onDelete}
          disableDelete={disableDelete}
          selected={selected}
          type={type}
        />
      </Section>
      { showPreview && (
        <PreviewContents
          id={showPreview}
          onClose={handleClosePreview}
          onDownload={handleDownloadAsset}
        />
      )}
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
