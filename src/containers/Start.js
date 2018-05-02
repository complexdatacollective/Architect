import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { compose } from 'recompose';
import { Button, Icon } from '../ui/components';
import { actionCreators as protocolsActions } from '../ducks/modules/protocols';
import { ProtocolCard } from '../components/Start';
import networkCanvasBrand from '../images/network-canvas-brand.svg';

class Start extends PureComponent {
  static propTypes = {
    protocols: PropTypes.array.isRequired,
    createProtocol: PropTypes.func.isRequired,
    chooseProtocol: PropTypes.func.isRequired,
    clearDeadLinks: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  };

  static defaultProps = {
    protocols: [],
  };

  componentDidMount() {
    this.props.clearDeadLinks();
  }

  openProtocol = (path) => {
    this.props.history.push(`/edit/${encodeURIComponent(path)}`);
  }

  render() {
    return (
      <div className="start">
        <div className="start__split">
          <div className="start__welcome">
            <h1 className="start__welcome-title">Architect</h1>
            <h2 className="start__welcome-lead">A tool for creating Network Canvas interviews</h2>
          </div>

          <div className="start__call-to-action">
            <Button
              id="create-new-protocol-button"
              type="button"
              color="white"
              size="small"
              icon={<Icon name="arrow-right" />}
              onClick={() => this.props.createProtocol(this.openProtocol)}
            >Create new</Button>
            <Button
              id="open-existing-protocol-button"
              type="button"
              size="small"
              color="cyber-grape"
              icon={<Icon name="arrow-right" />}
              onClick={() => this.props.chooseProtocol(this.openProtocol)}
            >Open existing</Button>
          </div>
        </div>

        <div className="start__split">
          { this.props.protocols.length > 0 &&
            <div className="start__protocols">
              { this.props.protocols.map((protocol, index) => (
                <div
                  className="start__protocols-protocol"
                  key={index}
                >
                  <ProtocolCard
                    path={protocol.path}
                    name={protocol.path}
                  />
                </div>
              )) }
            </div>
          }
        </div>

        <div className="start__background" />
        <img className="start__brand" src={networkCanvasBrand} alt="" />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  protocols: get(state, 'protocols', []).slice(-3),
});

const mapDispatchToProps = dispatch => ({
  createProtocol: bindActionCreators(protocolsActions.createProtocol, dispatch),
  loadProtocol: bindActionCreators(protocolsActions.loadProtocol, dispatch),
  chooseProtocol: bindActionCreators(protocolsActions.chooseProtocol, dispatch),
  clearDeadLinks: bindActionCreators(protocolsActions.clearDeadLinks, dispatch),
});

export { Start };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Start);
