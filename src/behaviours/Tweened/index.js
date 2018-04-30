import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import store, { actionCreators as actions } from './store';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const Tweenable = WrappedComponent =>
  class extends PureComponent {
    static propTypes = {
      tweenName: PropTypes.string.isRequired,
      before: PropTypes.number,
      duration: PropTypes.number,
      after: PropTypes.number,
      tweenElement: PropTypes.string,
    };

    static defaultProps = {
      before: 500,
      duration: 500,
      after: 300,
      tweenElement: undefined,
    };

    static displayName = `Tweened(${getDisplayName(WrappedComponent)})`;

    constructor(props) {
      super(props);
      this.tweenElement = this.props.tweenElement || uuid();
    }

    componentDidMount() {
      const node = ReactDOM.findDOMNode(this); // eslint-disable-line react/no-find-dom-node

      store.dispatch(
        actions.update(
          this.props.tweenName,
          this.props.tweenElement,
          { node },
        ),
      );
    }

    componentWillUnmount() {
      store.dispatch(
        actions.remove(
          this.props.tweenName,
          this.props.tweenElement,
        ),
      );
    }

    render() {
      return (
        <WrappedComponent {...this.props} />
      );
    }
  };

const Tweened = ({ tweenName, tweenElement, before, duration, after }) =>
  (WrappedComponent) => {
    const TweenedWrappedComponent = Tweenable(WrappedComponent);

    return props => (
      <TweenedWrappedComponent
        tweenName={tweenName}
        tweenElement={tweenElement}
        before={before || 500}
        duration={duration || 500}
        after={after || 500}
        {...props}
      />
    );
  };

export { Tweened };

export default Tweenable;
