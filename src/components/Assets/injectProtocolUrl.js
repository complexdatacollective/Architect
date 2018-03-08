import path from 'path';
import { connect } from 'react-redux';
import { compose, setPropTypes, mapProps } from 'recompose';
import PropTypes from 'prop-types';

const mapStateToProps = state => ({
  getProtocolUrl: url => (
    url ?
      `protocol:/${path.join(state.session.activeProtocol, 'assets', path.basename(url))}` :
      ''
  ),
});

const injectProtocolUrl = compose(
  connect(mapStateToProps),
  setPropTypes({
    url: PropTypes.string.isRequired,
  }),
  mapProps(({ dispatch, getProtocolUrl, url, ...rest }) => ({ ...rest, url: getProtocolUrl(url) })),
);

export default injectProtocolUrl;
