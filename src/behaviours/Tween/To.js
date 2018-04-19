/* eslint-disable */
import React, { PureComponent } from 'react';
import { compose } from 'redux';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import anime from 'animejs';
import { getContext } from 'recompose';
import getAbsoluteBoundingRect from '../../utils/getAbsoluteBoundingRect';

window.Tweens = window.Tweens || {};

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const To = WrappedComponent =>
  class extends PureComponent {
    static propTypes = {
      name: PropTypes.string.isRequired,
    };

    static defaultProps = {
    };

    static displayName = `Draft(${getDisplayName(WrappedComponent)})`;

    componentDidMount() {
      this.node = ReactDOM.findDOMNode(this); // eslint-disable-line react/no-find-dom-node
      window.Tweens = {
        ...window.Tweens,
        [this.props.name]: {
          ...window.Tweens[this.props.name],
          to: getAbsoluteBoundingRect(this.node),
        },
      };
      console.log(window.Tweens);
    }

    componentWillUnmount() {
      // window.Tweens = {
      //   ...window.Tweens,
      //   [this.props.name]: omit(window.Tweens[this.props.name], 'to'),
      // };
    }

    render() {
      return (
        <WrappedComponent {...this.props} />
      );
    }
  }

export default To;
