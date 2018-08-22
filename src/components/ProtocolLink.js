import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { actionCreators as navigationActions } from '../ducks/modules/navigation';

const ProtocolLink = ({ pathTo, to, children, ...rest }) =>
  (
    <Link to={pathTo(to)} {...rest} >
      {children}
    </Link>
  );

ProtocolLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  pathTo: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  pathTo: bindActionCreators(navigationActions.pathTo, dispatch),
});

export { ProtocolLink };

export default connect(null, mapDispatchToProps)(ProtocolLink);
