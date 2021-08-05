import React from 'react';
import { compose } from 'redux';
import cx from 'classnames';
import fse from 'fs-extra';
import { remote } from 'electron';
import window from '@codaco/ui/lib/components/window';
import { getCSSVariableAsNumber } from '@codaco/ui/lib/utils/CSSVariables';
import Stackable from '../Stackable';
import withAssetMeta from '../Assets/withAssetMeta';
import withAssetPath from '../Assets/withAssetPath';
import * as Assets from '../Assets';

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
  onClose,
}) => {
  const AssetRenderer = getRenderer(meta);
  const dialogZIndex = getCSSVariableAsNumber('--z-dialog');

  const handleDownload = () => {
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
  };

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
              <div className="asset-browser-preview__title-controls">
                <button
                  onClick={onClose}
                >
                  close
                </button>
                <button
                  onClick={handleDownload}
                >
                  download
                </button>
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
