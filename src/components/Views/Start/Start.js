import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { compose } from 'recompose';
import { Button, Icon } from '../../../ui/components';
import { actionCreators as protocolsActions } from '../../../ducks/modules/protocols';
import ProtocolStack from './ProtocolStack';
import networkCanvasBrand from '../../../images/network-canvas-brand.svg';

class Start extends PureComponent {
  static propTypes = {
    recentProtocols: PropTypes.array.isRequired,
    createAndLoadProtocol: PropTypes.func.isRequired,
    openProtocol: PropTypes.func.isRequired,
    clearDeadLinks: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  };

  static defaultProps = {
    protocols: [],
  };

  componentDidMount() {
    this.props.clearDeadLinks();
  }

  openProtocol = (protocol) => {
    this.props.history.push(`/edit/${encodeURIComponent(protocol.id)}`);
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
              color="platinum"
              size="small"
              icon={<Icon name="arrow-right" color="charcoal" />}
              onClick={this.props.createAndLoadProtocol}
            >Create new</Button>
            <Button
              id="open-existing-protocol-button"
              type="button"
              size="small"
              color="cyber-grape"
              icon={<Icon name="arrow-right" />}
              onClick={this.props.openProtocol}
            >Open existing</Button>
          </div>
        </div>

        <div className="start__split">
          { this.props.recentProtocols.length > 0 &&
            <div className="start__protocols">
              { this.props.recentProtocols.map((protocol, index) => (
                <div
                  className="start__protocols-protocol"
                  key={index}
                >
                  <ProtocolStack
                    protocol={protocol}
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
  recentProtocols: get(state, 'recentProtocols', []).slice(0, 3),
});

const mapDispatchToProps = dispatch => ({
  createAndLoadProtocol: bindActionCreators(protocolsActions.createAndLoadProtocol, dispatch),
  openProtocol: bindActionCreators(protocolsActions.openProtocol, dispatch),
  clearDeadLinks: () => {},
  // clearDeadLinks: bindActionCreators(protocolsActions.clearDeadLinks, dispatch),
});

export { Start };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Start);
