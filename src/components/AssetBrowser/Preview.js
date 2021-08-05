import React from 'react';
import window from '@codaco/ui/lib/components/window';
import { getCSSVariableAsNumber } from '@codaco/ui/lib/utils/CSSVariables';
import Stackable from '../Stackable';
import withAssetMeta from '../Assets/withAssetMeta';
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
}) => {
  const AssetRenderer = getRenderer(meta);
  const dialogZIndex = getCSSVariableAsNumber('--z-dialog');

  return (
    <Stackable stackKey>
      {({ stackIndex }) => (
        <div
          className="asset-browser-preview"
          style={{
            zIndex: dialogZIndex + stackIndex,
          }}
        >
          <div className="asset-browser-preview__container">
            <div className="asset-browser-preview__title">
              <h3>{meta.source}</h3>
              <button>close</button>
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

export default window(withAssetMeta(Preview));
