import React from 'react';
import PreviewControls from './PreviewControls';

const Chrome = ({ location }) => (
  <div className="previewer">
    <iframe
      className="previewer__content"
      title="foo"
      src={`/nc${location.pathname}`}
    />
    <PreviewControls />
  </div>
);

export default Chrome;
