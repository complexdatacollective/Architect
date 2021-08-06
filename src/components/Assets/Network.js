import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import fse from 'fs-extra';
import withAssetPath from './withAssetPath';
import withAssetMeta from './withAssetMeta';

const Network = ({ assetPath, meta }) => {
  const [content, setContent] = useState();

  useEffect(() => {
    if (!assetPath) {
      setContent(null);
      return;
    }

    if (/\.json$/.test(meta.name)) {
      fse.readJson(assetPath, 'utf8')
        .then((json) => {
          setContent(JSON.stringify(json, null, 2));
        });
      return;
    }

    fse.readFile(assetPath, 'utf8')
      .then(setContent);
  }, [assetPath]);

  return (
    <div>
      <pre>
        {content}
      </pre>
    </div>
  );
};

Network.propTypes = {
  assetPath: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export { Network };

export default compose(
  withAssetPath,
  withAssetMeta,
)(Network);
