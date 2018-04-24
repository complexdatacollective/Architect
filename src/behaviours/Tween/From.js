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

    constructor(props) {
      super(props);
      this.el = document.createElement('div');
      this.root = document.getElementsByTagName('body')[0];
    }

    componentDidMount() {
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
    }

    onClick = () => {
      const { from, to } = window.Tweens[this.props.name];

      const Clone = this.node.cloneNode(true);

      Clone.style.position = 'absolute';
      Clone.style.transform = 'translateZ(0)';
      Clone.style.top = `${get(from, 'top', 0)}px`;
      Clone.style.left = `${get(from, 'left', 0)}px`;
      Clone.style.width = `${get(from, 'width', 0)}px`;
      Clone.style.height = `${get(from, 'height', 0)}px`;
      Clone.style.transformOrigin = '0px 0px';

      this.root.appendChild(Clone);

      setTimeout(() => {
        Clone.className = `${Clone.className} tween`;
      }, 1);

      const animation = {
        targets: Clone,
        elasticity: 0,
        easing: 'easeInOutQuad',
        duration: getCSSVariableAsNumber('--animation-duration-standard-ms'),
        translateY: [0, get(to, 'top', 0) - get(from, 'top', 0)],
        translateX: [0, get(to, 'left', 0) - get(from, 'left', 0)],
        scaleX: [1, get(to, 'width', 0) / get(from, 'width', 0)],
        scaleY: [1, get(to, 'height', 0) / get(from, 'height', 0)],
      };

      console.log(animation);

      anime.timeline()
        .add({
          targets: Clone,
          elasticity: 0,
          easing: 'easeInOutQuad',
          duration: 200,
          opacity: [0, 1],
        })
        .add(animation)
        .add({
          targets: Clone,
          elasticity: 0,
          easing: 'easeInOutQuad',
          duration: 200,
          opacity: [1, 0],
        })
        .finished
        .then(() => {
          this.root.removeChild(Clone);
        });
    }

    render() {
      return (
        <WrappedComponent {...this.props} />
      );
    }
  }

export default From;
