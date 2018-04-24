/* eslint-disable */
import React, { PureComponent } from 'react';
import { compose } from 'redux';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { omit, get } from 'lodash';
import anime from 'animejs';
import { getContext } from 'recompose';
import getAbsoluteBoundingRect from '../../utils/getAbsoluteBoundingRect';
import { getCSSVariableAsNumber, getCSSVariableAsString } from '../../utils/CSSVariables';

window.Tweens = window.Tweens || [];

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const From = WrappedComponent =>
  class extends PureComponent {
    static propTypes = {
      name: PropTypes.string.isRequired,
    };

    static defaultProps = {
    };

    static displayName = `Draft(${getDisplayName(WrappedComponent)})`;

    componentDidMount() {
      this.root = document.getElementsByTagName('body')[0];
      this.node = ReactDOM.findDOMNode(this); // eslint-disable-line react/no-find-dom-node
      window.Tweens = {
        ...window.Tweens,
        [this.props.name]: {
          ...window.Tweens[this.props.name],
          from: getAbsoluteBoundingRect(this.node),
        },
      };
      console.log(window.Tweens);
      this.node.addEventListener('click', () => setTimeout(() => this.onClick(), 1));
    }

    componentWillUnmount() {
      this.node.removeEventListener('click', this.onClick);
      // window.Tweens = {
      //   ...window.Tweens,
      //   [this.props.name]: omit(window.Tweens[this.props.name], 'from'),
      // };
    }

    onClick = () => {
      const pseudoElement = document.createElement('div');
      const { from, to } = window.Tweens[this.props.name];

      pseudoElement.style.position = 'absolute';
      pseudoElement.style.transform = 'translateZ(0)';
      pseudoElement.style.backgroundColor = getCSSVariableAsString('--architect-panel-background');

      this.root.appendChild(pseudoElement);

      const animation = {
        targets: pseudoElement,
        elasticity: 0,
        easing: 'easeInOutQuad',
        duration: 1000, // getCSSVariableAsNumber('--animation-duration-fast-ms'),
        top: [get(from, 'top', 0), get(to, 'top', 0)],
        left: [get(from, 'left', 0), get(to, 'left', 0)],
        width: [get(from, 'width', 0), get(to, 'width', 0)],
        height: [get(from, 'height', 0), get(to, 'height', 0)],
      };

      console.log(animation);

      anime.timeline()
        .add({
          targets: pseudoElement,
          elasticity: 0,
          easing: 'easeInOutQuad',
          duration: 200,
          opacity: [0, 1],
        })
        .add(animation)
        .add({
          targets: pseudoElement,
          elasticity: 0,
          easing: 'easeInOutQuad',
          duration: 200,
          opacity: [1, 0],
        })
        .finished
        .then(() => {
          this.root.removeChild(pseudoElement);
        });
    }

    render() {
      return (
        <WrappedComponent {...this.props} />
      );
    }
  }

export default From;
