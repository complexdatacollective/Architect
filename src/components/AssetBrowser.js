import React from 'react';
import { compose } from 'recompose';
import window from '../ui/components/window';
import stackable from '../behaviours/stackable';

const AssetBrowser = ({ stackIndex }) => (
  <div className="asset-browser" style={{ zIndex: stackIndex + 10000 }}>
    hello world. { stackIndex }
  </div>
);

export default compose(
  stackable,
  window,
)(AssetBrowser);
