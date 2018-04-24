import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { omit, pick } from 'lodash';
import uuid from 'uuid';
import getAbsoluteBoundingRect from '../../utils/getAbsoluteBoundingRect';
import tween from './tween';

window.Tweens = window.Tweens || [];

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const Tweened = WrappedComponent =>
  class extends PureComponent {
    static propTypes = {
      name: PropTypes.string.isRequired,
      before: PropTypes.number,
      duration: PropTypes.number,
      after: PropTypes.number,
    };

    static defaultProps = {
      before: 500,
      duration: 500,
      after: 300,
    };

    static displayName = `Tweened(${getDisplayName(WrappedComponent)})`;

    constructor(props) {
      super(props);
      this.uuid = uuid();
    }

    componentDidMount() {
      this.node = ReactDOM.findDOMNode(this); // eslint-disable-line react/no-find-dom-node

      window.Tweens = {
        ...window.Tweens,
        [this.props.name]: {
          ...window.Tweens[this.props.name],
          [this.uuid]: {
            node: this.node,
            ...getAbsoluteBoundingRect(this.node),
          },
        },
      };
      this.node.addEventListener('click', () => setTimeout(() => this.onClick(), 1));
    }

    componentWillUnmount() {
      this.node.removeEventListener('click', this.onClick);

      window.Tweens = {
        ...window.Tweens,
        [this.props.name]: omit(window.Tweens[this.props.name], this.uuid),
      };
    }

    onClick = () => {
      const options = {
        uuid: this.uuid,
        ...pick(this.props, ['name', 'before', 'duration', 'after']),
      };
      tween(options);
    }

    render() {
      return (
        <WrappedComponent {...this.props} />
      );
    }
  };

export default Tweened;
