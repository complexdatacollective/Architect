import { getAssetManifest } from '@selectors/protocol';
import { getWorkingPath } from '@selectors/session';
import { pathSync } from '@utils/electronBridge';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, setPropTypes } from 'recompose';

const mapStateToProps = (state, { id }) => {
  const assetManifest = getAssetManifest(state);
  const workingPath = getWorkingPath(state);
  const source = get(assetManifest, [id, 'source'], '');
  const assetPath = pathSync.join(
    workingPath,
    'assets',
    pathSync.basename(source),
  );

  return {
    assetPath,
  };
};

const withAssetUrl = compose(
  setPropTypes({
    id: PropTypes.string.isRequired,
  }),
  connect(mapStateToProps, {}),
);

export default withAssetUrl;
