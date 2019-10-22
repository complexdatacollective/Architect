import { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { actionCreators as loadProtocolActions } from '../ducks/modules/protocols/load';
import { actionCreators as sessionActions } from '../ducks/modules/session';

class ProtocolLoader extends Component {
  constructor(props) {
    super(props);

    // TODO: Should this go into redux?
    this.state = {
      protocol: '',
    };
  }

  componentDidMount() {
    this.checkForProtocolAndLoad(this.props.match);
  }

  componentWillReceiveProps(newProps) {
    this.checkForProtocolAndLoad(newProps.match);
  }

  checkForProtocolAndLoad = (match) => {
    if (!match) { this.resetSession(); return; }
    const protocolId = decodeURIComponent(match.params.protocol);
    this.loadProtocol(protocolId);
  };

  resetSession = () => {
    if (!this.state.protocol) { return; }

    this.setState(
      { protocol: null },
      () => this.props.resetSession(),
    );
  }

  loadProtocol(protocol) {
    // If we've already loaded this route, don't load it again because we'll lose any changes
    if (protocol === this.state.protocol) { return; }

    this.setState(
      { protocol },
      () => this.props.loadProtocol(protocol),
    );
  }

  render() {
    return null;
  }
}

const mapDispatchToProps = dispatch => ({
  loadProtocol: bindActionCreators(loadProtocolActions.loadProtocol, dispatch),
  resetSession: bindActionCreators(sessionActions.resetSession, dispatch),
});

ProtocolLoader.propTypes = {
  loadProtocol: PropTypes.func.isRequired,
  resetSession: PropTypes.func.isRequired,
  match: PropTypes.object,
};

ProtocolLoader.defaultProps = {
  match: null,
};

export { ProtocolLoader };

export default connect(
  null,
  mapDispatchToProps,
)(ProtocolLoader);
