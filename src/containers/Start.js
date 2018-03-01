import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators as protocolsActions } from '../ducks/modules/protocols';

class Start extends PureComponent {
  static propTypes = {
    protocols: PropTypes.array.isRequired,
    createProtocol: PropTypes.func.isRequired,
    loadProtocol: PropTypes.func.isRequired,
    locateAndLoadProtocol: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div className="start">
        <button onClick={() => this.export()}>Export</button>
        <button onClick={() => this.props.createProtocol()}>Create new Protocol</button>
        <button onClick={() => this.props.locateAndLoadProtocol()}>Open a protocol</button>

        { this.props.protocols.map(protocol => (
          <button onClick={() => this.props.loadProtocol(protocol.path)}>
            Load &quot;{protocol.path}&quot;
          </button>
        )) }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  protocols: state.protocols,
});

const mapDispatchToProps = dispatch => ({
  createProtocol: bindActionCreators(protocolsActions.createProtocol, dispatch),
  loadProtocol: bindActionCreators(protocolsActions.loadProtocol, dispatch),
  locateAndLoadProtocol: bindActionCreators(protocolsActions.locateAndLoadProtocol, dispatch),
});

export { Start };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Start);
