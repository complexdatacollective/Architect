import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { actionCreators as protocolsActions } from '../ducks/modules/protocols';

class Start extends PureComponent {
  static propTypes = {
    activeProtocol: PropTypes.string.isRequired,
    protocols: PropTypes.array.isRequired,
    createProtocol: PropTypes.func.isRequired,
    loadProtocol: PropTypes.func.isRequired,
  };

  render() {
    const {
      createProtocol,
      protocols,
      loadProtocol,
      activeProtocol,
    } = this.props;

    if (activeProtocol) { return <Redirect to={{ pathname: '/edit' }} />; }

    return (
      <div className="start">
        <Link className="start__protocol" to="/edit">View protocol</Link>
        <button onClick={() => this.export()}>Export</button>
        <button onClick={() => createProtocol()}>Create new Protocol</button>

        { protocols.map(protocol => (
          <button onClick={() => loadProtocol(protocol.path)}>
            Load &quot;{protocol.path}&quot;
          </button>
        )) }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  protocols: state.protocols,
  activeProtocol: state.protocolMeta.activeProtocol,
});

const mapDispatchToProps = dispatch => ({
  createProtocol: bindActionCreators(protocolsActions.createProtocol, dispatch),
  loadProtocol: bindActionCreators(protocolsActions.loadProtocol, dispatch),
});

export { Start };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Start);
