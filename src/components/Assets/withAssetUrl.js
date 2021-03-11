import path from 'path';
import { connect } from 'react-redux';
import { compose, setPropTypes } from 'recompose';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { getWorkingPath } from '@selectors/session';
import { getAssetManifest } from '@selectors/protocol';

const mapStateToProps = (state, { id }) => {
  const assetManifest = getAssetManifest(state);
  const workingPath = getWorkingPath(state);
  const source = get(assetManifest, [id, 'source'], '');
  const assetPath = path.join(workingPath, 'assets', path.basename(source));
  const encodedURI = encodeURIComponent(assetPath);
  const url = source
    ? `asset://${encodedURI}`
    : '';

  return {
    url,
  };
};

const withAssetUrl = compose(
  setPropTypes({
    id: PropTypes.string.isRequired,
  }),
  connect(mapStateToProps, {}),
);

export default withAssetUrl;
