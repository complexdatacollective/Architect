import React from 'react';
import PropTypes from 'prop-types';
import MiniTable from './MiniTable';
import useAssetData from './useAssetData';

const Asset = ({
  id,
}) => {
  const {
    variables,
    url,
    name,
    type,
  } = useAssetData(id);

  return (
    <div className="protocol-summary-asset-manifest__asset" id={`asset-${id}`}>
      <h4>{name}</h4>

      { type === 'image' && (
        <div className="protocol-summary-asset-manifest__asset-image">
          <img src={url} alt="preview" />
        </div>
      )}

      {variables && (
        <MiniTable
          wide
          lite
          rows={
            [
              [<strong>Variables</strong>],
              ...variables,
            ]
          }
        />
      )}
    </div>
  );
};

Asset.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Asset;
