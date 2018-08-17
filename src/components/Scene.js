/* eslint-disable */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Flipper, Flipped } from 'react-flip-toolkit';
import cx from 'classnames';
import ProtocolStack from './Views/Start/ProtocolStack';

class Scene extends Component {
  static propTypes = {
    protocol: PropTypes.object,
    protocols: PropTypes.array,
  };

  static defaultProps = {
    protocol: null,
    protocols: [
      { id: 1, workingPath: 1 },
      { id: 2, workingPath: 2 },
      { id: 3, workingPath: 3 },
    ],
  };

  constructor(props) {
    super(props);

    this.state = {
      openStack: null,
      mode: 'start',
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.match && this.props.match) {
      console.log('in', this.state);
      this.setState({ mode: 'protocol' });
    }
    if (prevProps.match && !this.props.match) {
      console.log('out');
      this.setState({ mode: 'start' });
    }
  }

  openStack(index) {
    this.setState({
      openStack: index,
    });
  }

  isProtocol() {
    return this.state.mode === 'protocol';
  }

  renderRecentProtocol = (protocol) => {
    return (
      <Flipped flipId={protocol.filePath} key={protocol.filePath}>
        <div
          className="scene__stack"
          onClick={() => this.openStack(protocol.filePath)}
        >
          <ProtocolStack
            protocol={protocol}
          />
        </div>
      </Flipped>
    );
  }

  render() {
    const sceneClasses = cx(
      'scene',
      { 'scene--protocol': this.isProtocol() },
    );

    console.log({ state: this.state });

    return (
      <div className={sceneClasses}>
        <Flipper flipKey={`${this.state.openStack}-${this.isProtocol()}`}>
          <div className="scene__stacks">
            { !this.isProtocol() && this.props.recentProtocols.map(this.renderRecentProtocol) }
          </div>
          <div className="scene__loader">
            <div onClick={this.props.createProtocol}>Create new</div>
          </div>
          { this.isProtocol() &&
            <Flipped flipId={this.state.openStack}>
              <div className="scene__overview" ref={this.overviewRef}>
              </div>
            </Flipped>
          }
          <div className="scene__timeline">
            <div className="stage"></div>
            <div className="stage"></div>
            <div className="stage"></div>
            <div className="stage"></div>
            <div className="stage"></div>
            <div className="stage"></div>
            <div className="stage"></div>
          </div>
        </Flipper>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  recentProtocols: [{ filePath: 'rstst' }, { filePath: 'bar' }], //get(state, 'recentProtocols', []).slice(0, 3),
});

const mapDispatchToProps = dispatch => ({
  // createProtocol: bindActionCreators(protocolsActions.createAndLoadProtocol, dispatch),
  // chooseProtocol: bindActionCreators(protocolsActions.chooseProtocol, dispatch),
});

export { Scene };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Scene);
