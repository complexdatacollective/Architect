import React from 'react';
import Stackable from '../Stackable';
import withAssetMeta from '../Assets/withAssetMeta';

const Preview = ({ id, meta }) => (
  <Stackable stackKey={id}>
    {({ stackIndex }) => (
      <div
        style={{
          width: '100%',
          height: '100%',
          zIndex: stackIndex,
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        Hello { JSON.stringify(meta) }
      </div>
    )}
  </Stackable>
);

Preview.defaultProps = {
  show: false,
  id: null,
};

export default withAssetMeta(Preview);
