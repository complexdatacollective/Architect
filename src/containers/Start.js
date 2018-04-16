import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { actionCreators as protocolsActions } from '../ducks/modules/protocols';

class Start extends PureComponent {
  static propTypes = {
    protocols: PropTypes.array.isRequired,
    createProtocol: PropTypes.func.isRequired,
    loadProtocol: PropTypes.func.isRequired,
    locateAndLoadProtocol: PropTypes.func.isRequired,
  };

  static defaultProps = {
    protocols: [],
  };

  render() {
    return (
      <div className="start">

        <div className="start__hero">
          <div className="start__welcome">
            <h1 className="start__welcome-title">Architect</h1>
            <p className="start__welcome-lead">A tool for creating Network Canvas interviews</p>
          </div>

          <div className="start__call-to-action">
            <button onClick={() => this.props.createProtocol()}>Create new</button>
            <button onClick={() => this.props.locateAndLoadProtocol()}>Open existing</button>
          </div>
        </div>

        <div className="start__protocols">
          { this.props.protocols.map((protocol, index) => (
            <div
              className="start__protocol"
              key={index}
              onClick={() => this.props.loadProtocol(protocol.path)}
            >
              Load &quot;{protocol.path}&quot;
            </div>
          )) }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  protocols: get(state, 'protocols', []),
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
