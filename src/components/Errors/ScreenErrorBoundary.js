import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@codaco/ui';

class CardErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error) {
    this.setState({ error });
    console.log(error); // eslint-disable-line no-console
  }

  canAcknowledge = () => {
    const { onAcknowledge } = this.props;
    return !!onAcknowledge;
  };

  render() {
    const { error } = this.state;
    const {
      onAcknowledge,
      children,
    } = this.props;

    if (error) {
      return (
        <div className="error" style={{ position: 'relative' }}>
          <div className="error__layout">
            <h1 className="error__title">Something went wrong.</h1>
            <div className="error__message">
              { error.message && <p>{error.message}</p> }
              { this.canAcknowledge()
                && (
                <Button
                  size="small"
                  color="platinum"
                  onClick={onAcknowledge}
                >
                  OK
                </Button>
                )}
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

CardErrorBoundary.propTypes = {
  children: PropTypes.node,
  onAcknowledge: PropTypes.func,
};

CardErrorBoundary.defaultProps = {
  children: null,
  onAcknowledge: null,
};

export default CardErrorBoundary;
