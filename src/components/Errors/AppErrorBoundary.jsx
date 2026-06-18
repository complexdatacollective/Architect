import PropTypes from 'prop-types';
import { Component } from 'react';

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error) {
    this.setState({ error });
  }

  render() {
    const { error } = this.state;
    const { children } = this.props;

    if (error) {
      return (
        <div className="error">
          <div className="error__layout">
            <h1 className="error__title">Something went wrong.</h1>
            <div className="error__message">
              <p>
                The following &quot;
                {error.message}
                &quot; error occurred:
              </p>
            </div>
            <pre className="error__stack">
              <code>{error.stack}</code>
            </pre>
          </div>
        </div>
      );
    }

    return children;
  }
}

AppErrorBoundary.propTypes = {
  children: PropTypes.node,
};

AppErrorBoundary.defaultProps = {
  children: null,
};

export default AppErrorBoundary;
