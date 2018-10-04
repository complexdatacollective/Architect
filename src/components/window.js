import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const getDisplayName = WrappedComponent =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component';

const window = WrappedComponent =>
  class Window extends Component {
    constructor(props) {
      super(props);

      this.portal = document.createElement('div');
    }

    componentDidMount() {
      document.body.appendChild(this.portal);
    }

    componentWillUnmount() {
      document.body.removeChild(this.portal);
    }

    static get displayName() {
      return `Window(${getDisplayName(WrappedComponent)})`;
    }

    render() {
      return ReactDOM.createPortal(
        <WrappedComponent {...this.props} />,
        this.portal,
      );
    }
  };

export { window };

export default window;
