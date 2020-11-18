import { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import history from '@app/history';
import { getActiveProtocol } from '@selectors/session';

const CheckProtocolLoaded = ({
  activeProtocol,
}) => {
  useEffect(() => {
    if (activeProtocol) { return; }

    history.push('/');
  }, [activeProtocol]);

  return null;
};

const mapStateToProps = state => ({
  activeProtocol: getActiveProtocol(state),
});

CheckProtocolLoaded.propTypes = {
  activeProtocol: PropTypes.string,
};

CheckProtocolLoaded.defaultProps = {
  activeProtocol: null,
};

const withState = connect(mapStateToProps, {});

export { CheckProtocolLoaded };

export default withState(CheckProtocolLoaded);
