import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { pick } from 'lodash';
import uuid from 'uuid';
import tween from './tween';
import store, { actionCreators as actions } from './store';

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
      uuid: PropTypes.string,
    };

    static defaultProps = {
      before: 500,
      duration: 500,
      after: 300,
      uuid: undefined,
    };

    static displayName = `Tweened(${getDisplayName(WrappedComponent)})`;

    constructor(props) {
      super(props);
      this.uuid = this.props.uuid || uuid();
    }

    componentDidMount() {
      this.node = ReactDOM.findDOMNode(this); // eslint-disable-line react/no-find-dom-node

      store.dispatch(actions.update(
        this.props.name,
        this.props.uuid,
        { node: this.node },
      ));
    }

    componentWillUnmount() {
      this.node.removeEventListener('click', this.onClick);
      store.dispatch(actions.remove(this.props.name, this.props.uuid));
    }

    onClick = () => {
      const options = {
        from: this.uuid,
        ...pick(this.props, ['name', 'to', 'before', 'duration', 'after']),
      };

      setTimeout(
        tween(options),
        1,
      );
    }

    render() {
      return (
        <WrappedComponent {...this.props} />
      );
    }
  };

export default Tweened;
