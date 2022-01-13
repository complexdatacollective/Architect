import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import cx from 'classnames';
import { Button } from '@codaco/ui';
import DownloadIcon from '@material-ui/icons/GetApp';
import withAssetMeta from '@components/Assets/withAssetMeta';
import withAssetPath from '@components/Assets/withAssetPath';
import * as Assets from '@components/Assets';
import Screen from '../Screen/Screen';
import ControlBar from '../ControlBar';

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

  const leftControls = [
    <Button
      onClick={onClose}
      color="white"
      key="close"
    >
      Close preview
    </Button>,
  ];

  const rightControls = [
    <Button
      onClick={handleDownload}
      icon={<DownloadIcon />}
      key="download"
    >
      Download asset
    </Button>,
  ];

  const className = cx(
    'asset-browser-preview',
    `asset-browser-preview--type-${meta.type}`,
  );

  return (
    <Screen
      header={(
        <div className="stage-header">
          {meta.name}
        </div>
      )}
      footer={(
        <ControlBar
          buttons={leftControls}
          secondaryButtons={rightControls}
        />
      )}
    >
      <AssetRenderer id={id} />
    </Screen>
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
