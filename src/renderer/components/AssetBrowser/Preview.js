import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import cx from 'classnames';
import { Button } from '@codaco/ui';
import Window from '@components/Window';
import ContentCopyIcon from '@material-ui/icons/FileCopy';
import DownloadIcon from '@material-ui/icons/GetApp';
import withAssetMeta from '@components/Assets/withAssetMeta';
import withAssetPath from '@components/Assets/withAssetPath';
import * as Assets from '@components/Assets';

const getRenderer = (meta) => {
  switch (meta.type) {
    case 'image':
      return Assets.BackgroundImage;
    case 'audio':
      // eslint-disable-next-line
      return ({ id }) => <Assets.Audio id={id} controls />;
    case 'video':
      // eslint-disable-next-line
      return ({ id }) => <Assets.Video id={id} controls />;
    case 'network':
      return Assets.Network;
    case 'geojson':
      return Assets.GeoJSON;
    case 'apikey':
      return Assets.APIKey;
    default:
      return () => <p>No preview available.</p>;
  }
};

const Preview = ({
  id,
  meta,
  assetPath,
  onDownload,
  onClose,
}) => {
  const AssetRenderer = getRenderer(meta);

  const handleDownload = useCallback(() => {
    onDownload(assetPath, meta);
  }, [onDownload, assetPath, meta]);

  const handleCopyKey = useCallback(() => {
    if (meta.value) {
      navigator.clipboard.writeText(meta.value);
    }
  }, []);

  const primaryButtons = [
    <Button
      onClick={onClose}
      color="white"
      key="close"
    >
      Close preview
    </Button>,
  ];

  // API keys are copied instead of downloaded
  const secondaryButtons = meta.type !== 'apikey' ? [
    <Button
      onClick={handleDownload}
      icon={<DownloadIcon />}
      key="download"
    >
      Download asset
    </Button>,
  ] : [
    <Button
      onClick={handleCopyKey}
      icon={<ContentCopyIcon />}
      key="copy"
    >
      Copy API Key
    </Button>,
  ];

  const className = cx(
    'asset-browser-preview',
    `asset-browser-preview--type-${meta.type}`,
  );

  return (
    <Window
      title={meta.name}
      className={className}
      leftControls={secondaryButtons}
      rightControls={primaryButtons}
      windowRoot={document.body}
    >
      <AssetRenderer id={id} />
    </Window>
  );
};

Preview.propTypes = {
  id: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  assetPath: PropTypes.string.isRequired,
  onDownload: PropTypes.func,
  onClose: PropTypes.func,
};

Preview.defaultProps = {
  onDownload: () => {},
  onClose: () => {},
};

export default compose(
  withAssetMeta,
  withAssetPath,
)(Preview);
