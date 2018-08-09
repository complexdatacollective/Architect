/* eslint-disable */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { get } from 'lodash';
import cx from 'classnames';
import animate from 'animejs';
import getAbsoluteBoundingRect from '../utils/getAbsoluteBoundingRect';
import { actionCreators as protocolsActions } from '../ducks/modules/protocols';
import ProtocolStack from './Views/Start/ProtocolStack';

const tween = (fromEl, toEl) => {
  const from = getAbsoluteBoundingRect(fromEl);
  const to = getAbsoluteBoundingRect(toEl);

  const clone = fromEl.cloneNode(true);

  document.body.appendChild(clone);

  clone.style.position = 'absolute';
  clone.style.opacity = 1;
  clone.style.left =  `${from.left}px`;
  clone.style.top = `${from.top}px`;
  clone.style.width = `${from.width}px`;
  clone.style.height = `${from.height}px`;

  console.log(from, to);

  animate({
    targets: clone,
    opacity: 0,
    left: to.left,
    top: to.top,
    width: to.width,
    height: to.height,
    elasticity: 0,
    duration: 5000,
  });
};

class Scene extends Component {
  static propTypes = {
    protocol: PropTypes.object,
    protocols: PropTypes.array,
  };

  static defaultProps = {
    protocol: null,
    protocols: [],
  };

  constructor(props) {
    super(props);

    this.protocolRefs = [
      React.createRef(),
      React.createRef(),
      React.createRef(),
    ];

    this.overviewRef = React.createRef();

    this.state = {
      openStack: null,
      mode: 'wfpol',
    };
  }

  componentDidUpdate(prevProps, prevState) {
    console.log({ prevProps, props: this.props });
    if (prevProps.match === this.props.match) {
      return;
    }
    if (!prevProps.match && this.props.match) {
      // animate in
      console.log('in', this.state);

      const from = this.state.openStack.current;
      const to = this.overviewRef.current

      tween(from, to);

      console.log(from, to);
      this.setState({ mode: 'protocol' });
    }
    if (prevProps.match && !this.props.match) {
      // animate out
      console.log('out');
    }
  }

  openStack(ref) {
    this.setState({
      openStack: ref,
    });
  }

  render() {
    const sceneClasses = cx(
      'scene',
      { 'scene--protocol': this.state.mode === 'protocol' },
    );

    return (
      <div className={sceneClasses}>
        <div className="scene__stacks">
          { this.props.protocols.map((protocol, index) => (
            <div
              className="scene__stack"
              key={index}
              ref={this.protocolRefs[index]}
              onClick={() => this.openStack(this.protocolRefs[index])}
            >
              <ProtocolStack
                protocol={protocol}
              />
            </div>
          )) }
        </div>
        <div className="scene__loader">
          <div onClick={this.props.createProtocol}>Create new</div>
        </div>
        <div className="scene__overview" ref={this.overviewRef}>
        </div>
        <div className="scene__timeline">
          <div className="stage"></div>
          <div className="stage"></div>
          <div className="stage"></div>
          <div className="stage"></div>
          <div className="stage"></div>
          <div className="stage"></div>
          <div className="stage"></div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  protocols: get(state, 'protocols', []).slice(0, 3),
});

const mapDispatchToProps = dispatch => ({
  createProtocol: bindActionCreators(protocolsActions.createProtocol, dispatch),
  chooseProtocol: bindActionCreators(protocolsActions.chooseProtocol, dispatch),
});

export { Scene };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Scene);
