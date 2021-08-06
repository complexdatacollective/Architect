import React, { useCallback } from 'react';
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
      return Assets.Image;
    case 'network':
      return Assets.Network;
    default:
      return () => JSON.stringify(meta);
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
              <AssetRenderer id={id} meta={meta} />
            </div>
          </div>
        </div>
      )}
    </Stackable>
  );
};

Preview.defaultProps = {
  show: false,
  id: null,
};

export default compose(
  window,
  withAssetMeta,
  withAssetPath,
)(Preview);
