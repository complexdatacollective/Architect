import React from 'react';
import PropTypes from 'prop-types';
import AutoFileDrop from '../Form/AutoFileDrop';

/**
 * Data source, which can be async or json file
 *
 * Value should be assetId
 */
const NewAsset = ({
  type,
  onCreate,
}) => (
  <>
    <AutoFileDrop
      type={type}
      onDrop={onCreate}
    />
  </>
);

NewAsset.propTypes = {
  type: PropTypes.string,
  onCreate: PropTypes.func,
};

NewAsset.defaultProps = {
  type: null,
  onCreate: () => {},
};

export default NewAsset;
