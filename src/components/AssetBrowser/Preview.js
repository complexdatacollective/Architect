import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import withAssetMeta from '../Assets/withAssetMeta';

const Preview = ({
  id,
  meta,
}) => {
  const [root, setRoot] = useState(null);

  useEffect(() => {
    const el = document.createElement('div');
    el.setAttribute('id', 'test');
    document.body.appendChild(el);

    setRoot(el);

    return () => {
      setRoot(null);
      document.body.removeChild(el);
    };
  }, []);

  if (!root) { return null; }

  // console.log(root.current);

  return ReactDOM.createPortal(
    // eslint-disable-next-line react/jsx-props-no-spreading
    (
      <div
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          bottom: '1rem',
          right: '1rem',
          background: 'red',
          zIndex: 1000,
        }}
      >
        Test { JSON.stringify({ meta }) }
      </div>
    ),
    root,
  );
};

Preview.defaultProps = {
  show: false,
  id: null,
};

export default withAssetMeta(Preview);
