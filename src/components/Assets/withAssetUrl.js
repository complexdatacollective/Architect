import path from 'path';
import { connect } from 'react-redux';
import { compose, setPropTypes } from 'recompose';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { getActiveProtocolMeta } from '@selectors/protocols';
import { getAssetManifest } from '@selectors/protocol';

const mapStateToProps = (state, { id }) => {
  const activeProtocolMeta = getActiveProtocolMeta(state);
  const assetManifest = getAssetManifest(state);
  const workingPath = activeProtocolMeta && activeProtocolMeta.workingPath;
  const source = get(assetManifest, [id, 'source'], '');
  const assetPath = path.join(workingPath, 'assets', path.basename(source));
  const encodedURI = encodeURIComponent(assetPath);
  const url = source ?
    `asset://${encodedURI}` :
    '';

  return {
    url,
  };
};

const withAssetUrl = compose(
  setPropTypes({
    id: PropTypes.string.isRequired,
  }),
  connect(mapStateToProps),
);

export default withAssetUrl;
