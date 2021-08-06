import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import cx from 'classnames';
import window from '@codaco/ui/lib/components/window';
import { getCSSVariableAsNumber } from '@codaco/ui/lib/utils/CSSVariables';
import { Button } from '@codaco/ui';
import Stackable from '@components/Stackable';
import CloseIcon from '@material-ui/icons/Close';
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
  const dialogZIndex = getCSSVariableAsNumber('--z-dialog');

  const handleDownload = useCallback(() => {
    onDownload(assetPath, meta);
  }, [onDownload, assetPath, meta]);

  return (
    <Stackable stackKey>
      {({ stackIndex }) => (
        <div
          className={cx(
            'asset-browser-preview',
            `asset-browser-preview--type-${meta.type}`,
          )}
          style={{
            zIndex: dialogZIndex + stackIndex,
          }}
        >
          <div className="asset-browser-preview__container">
            <div className="asset-browser-preview__title">
              <h3>{meta.name}</h3>
              <div className="asset-browser-preview__title-download">
                <Button
                  onClick={handleDownload}
                  size="small"
                >
                  Download asset
                </Button>
              </div>
              <div
                className="asset-browser-preview__title-close"
                onClick={onClose}
              >
                <CloseIcon />
              </div>
            </div>
            <div className="asset-browser-preview__content">
              <AssetRenderer id={id} />
            </div>
          </div>
        </div>
      )}
    </Stackable>
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
  window,
  withAssetMeta,
  withAssetPath,
)(Preview);
