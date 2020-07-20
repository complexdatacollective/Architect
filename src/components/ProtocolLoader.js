import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { actionCreators as loadProtocolActions } from '../ducks/modules/protocols/load';
import { actionCreators as sessionActions } from '../ducks/modules/session';

const ProtocolLoader = ({
  loadProtocol,
  resetSession,
}) => {
  const { protocol } = useParams();
  useEffect(() => {
    loadProtocol(protocol);

    return () => resetSession();
  }, [protocol]);
  return (<div>loader{protocol}</div>);
};

const mapDispatchToProps = dispatch => ({
  loadProtocol: bindActionCreators(loadProtocolActions.loadProtocol, dispatch),
  resetSession: bindActionCreators(sessionActions.resetSession, dispatch),
});

ProtocolLoader.propTypes = {
  loadProtocol: PropTypes.func.isRequired,
  resetSession: PropTypes.func.isRequired,
};

const withState = connect(null, mapDispatchToProps);

export { ProtocolLoader };

export default withState(ProtocolLoader);
