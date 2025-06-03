import React from 'react';
import PropTypes from 'prop-types';
import { withState } from 'recompose';
import { fieldPropTypes } from 'redux-form';
import GeoJSONThumbnail from '@components/Thumbnail/GeoJSON';
import File from '../File';

const withSelectGeoAsset = withState('selectGeoAsset', 'setSelectGeoAsset', false);

const GeoDataSource = (props) => {
  const {
    input,
  } = props;
  return (
    <File
      type="geojson"
      selected={input.value}
        // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      { (id) => <GeoJSONThumbnail id={id} /> }
    </File>
  );
};

GeoDataSource.propTypes = {
  ...fieldPropTypes,
  canUseExisting: PropTypes.bool,
};

GeoDataSource.defaultProps = {
  canUseExisting: false,
};

export default withSelectGeoAsset(GeoDataSource);
