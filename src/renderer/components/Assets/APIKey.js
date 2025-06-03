import React from 'react';
import PropTypes from 'prop-types';
import withAssetMeta from './withAssetMeta';

const APIKey = ({ meta }) => (
  <h1 style={{ wordWrap: 'break-word' }}>
    {meta.value}
  </h1>
);

APIKey.propTypes = {
  meta: PropTypes.shape({
    value: PropTypes.string,
    name: PropTypes.string,
  }),
};

APIKey.defaultProps = {
  meta: {
    value: '',
  },
};

export default withAssetMeta(APIKey);
