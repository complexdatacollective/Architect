import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { actionCreators as protocolFilesActions } from '../ducks/modules/protocols/files';

class Start extends PureComponent {
  static propTypes = {
    protocols: PropTypes.array.isRequired,
    createProtocol: PropTypes.func.isRequired,
    loadProtocol: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div className="start">
        <Link className="start__protocol" to="/protocol">View protocol</Link>
        <button onClick={() => this.export()}>Export</button>
        <button onClick={() => this.props.createProtocol()}>Create new Protocol</button>

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
  createProtocol: bindActionCreators(protocolFilesActions.createProtocol, dispatch),
  loadProtocol: bindActionCreators(protocolFilesActions.loadProtocol, dispatch),
});

export { Start };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Start);
