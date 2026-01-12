import React, { Component } from 'react';
import Button from '@codaco/ui/lib/components/Button';
import PropTypes from 'prop-types';
import { electronAPI } from '@utils/electronBridge';

const closeWindow = () => electronAPI.window.hide();

class ProtocolSummaryErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error) {
    this.setState({ error });
    console.log(error); // eslint-disable-line no-console
  }

  render() {
    const { error } = this.state;
    const { children } = this.props;

    if (error) {
      return (
        <div className="error">
          <div className="error__layout">
            <h1 className="error__title">There was an error creating the protocol summary.</h1>
            <div className="error__message">
              <p>
                The following &quot;
                {error.message}
                &quot; error occurred:
              </p>
            </div>
            <pre className="error__stack allow-text-selection"><code>{error.stack}</code></pre>
            <p>
              Please help us to find and fix this error by contacting the Network Canvas team
              and providing the text above.
            </p>
            <Button color="platinum" onClick={closeWindow}>Close Window</Button>
          </div>
        </div>
      );
    }

    return children;
  }
}

ProtocolSummaryErrorBoundary.propTypes = {
  children: PropTypes.node,
};

ProtocolSummaryErrorBoundary.defaultProps = {
  children: null,
};

export default ProtocolSummaryErrorBoundary;
