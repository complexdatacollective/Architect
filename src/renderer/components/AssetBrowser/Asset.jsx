import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import PreviewIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import DownloadIcon from '@material-ui/icons/GetApp';
import * as Thumbnails from '@components/Thumbnail';

const FallBackAssetComponent = () => (
  <div>No preview component available for this asset type.</div>
);

const ASSET_COMPONENTS = {
  image: Thumbnails.Image,
  video: Thumbnails.Video,
  audio: Thumbnails.Audio,
  network: Thumbnails.Network,
  apikey: Thumbnails.APIKey,
  geojson: Thumbnails.GeoJSON,
};

const Asset = ({
  id,
  isUsed,
  onClick,
  onDelete,
  onDownload,
  onPreview,
  type,
}) => {
  const handleClick = useCallback((e) => {
    e.stopPropagation();
    onClick(id);
  }, [onClick, id]);

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    onDelete(id, isUsed);
  }, [onDelete, isUsed, id]);

  const handlePreview = useCallback((e) => {
    e.stopPropagation();
    onPreview(id);
  }, [onPreview, id]);

  const handleDownload = useCallback((e) => {
    e.stopPropagation();
    onDownload(id);
  }, [onDownload, id]);

  const PreviewComponent = useMemo(
    () => ASSET_COMPONENTS[type] || FallBackAssetComponent,
    [type],
  );

  const assetClasses = cx(
    'asset-browser-asset',
    { 'asset-browser-asset--clickable': onClick },
    { 'asset-browser-asset--is-used': isUsed },
  );

  return (
    <div
      onClick={handleClick}
      className={assetClasses}
    >
      <div className="asset-browser-asset__preview">
        <PreviewComponent id={id} />
      </div>

      <div className="asset-browser-asset__controls">
        { onPreview && (
          <div
            className="asset-browser-asset__control"
            onClick={handlePreview}
          >
            <PreviewIcon />
          </div>
        )}

        { onDownload && (
          <div
            className="asset-browser-asset__control"
            onClick={handleDownload}
          >
            <DownloadIcon />
          </div>
        )}

        { onDelete && (
          <div
            className="asset-browser-asset__control asset-browser-asset__control--delete"
            onClick={handleDelete}
            title={isUsed ? 'This asset is in use by the protocol and cannot be deleted' : ''}
          >
            <DeleteIcon />
          </div>
        )}
      </div>
    </div>
  );
};

Asset.propTypes = {
  id: PropTypes.string.isRequired,
  isUsed: PropTypes.bool,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
  onDownload: PropTypes.func,
  onPreview: PropTypes.func,
  type: PropTypes.string.isRequired,
};

Asset.defaultProps = {
  isUsed: false,
  onClick: () => {},
  onDelete: null,
  onPreview: () => {},
  onDownload: () => {},
};

export default Asset;
