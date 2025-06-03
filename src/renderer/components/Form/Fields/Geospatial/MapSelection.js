import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import Button from '@codaco/ui/lib/components/Button';

import MapView from './MapView';

const MapSelection = ({
  input: {
    value,
    onChange,
  },
}) => {
  const [showMap, setShowMap] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowMap(true)}
        color="primary"
        size="small"
      >
        {value.center ? 'Edit Map View' : 'Set Map View'}
      </Button>

      {showMap && createPortal(
        <MapView
          mapOptions={value}
          onChange={onChange}
          close={() => setShowMap(false)}
        />,
        document.body,
      )}
    </>
  );
};
MapSelection.propTypes = {
  input: PropTypes.shape({
    value: PropTypes.shape({
      center: PropTypes.arrayOf(PropTypes.number),
      tokenAssetId: PropTypes.string,
      initialZoom: PropTypes.number,
      dataSourceAssetId: PropTypes.string,
      color: PropTypes.string,
      targetFeatureProperty: PropTypes.string,
      style: PropTypes.string,
    }),
    onChange: PropTypes.func.isRequired,
  }).isRequired,
};

export default MapSelection;
