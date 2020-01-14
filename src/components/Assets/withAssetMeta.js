import { connect } from 'react-redux';
import { compose, setPropTypes } from 'recompose';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import {
  getAssetManifest,
} from '@selectors/protocol';

const existingMeta = {
  name: 'Interview network',
};

const mapStateToProps = (state, { id }) => {
  const assetManifest = getAssetManifest(state);
  const meta = get(assetManifest, id, existingMeta);

  return {
    meta,
  };
};

const withAssetMeta = compose(
  setPropTypes({
    id: PropTypes.string.isRequired,
  }),
  connect(mapStateToProps),
);

export default withAssetMeta;
