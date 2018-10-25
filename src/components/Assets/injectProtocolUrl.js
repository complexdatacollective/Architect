import path from 'path';
import { connect } from 'react-redux';
import { compose, setPropTypes, mapProps } from 'recompose';
import PropTypes from 'prop-types';
import { getActiveProtocolMeta } from '../../selectors/protocol';

const mapStateToProps = (state) => {
  const activeProtocolMeta = getActiveProtocolMeta(state);
  const workingPath = activeProtocolMeta && activeProtocolMeta.workingPath;

  return {
    getProtocolUrl: url => (
      url && workingPath ?
        `asset:/${path.join(workingPath, 'assets', path.basename(url))}` :
        ''
    ),
  };
};

const injectProtocolUrl = compose(
  connect(mapStateToProps),
  setPropTypes({
    url: PropTypes.string.isRequired,
  }),
  mapProps(({ dispatch, getProtocolUrl, url, ...rest }) => ({ ...rest, url: getProtocolUrl(url) })),
);

export default injectProtocolUrl;
