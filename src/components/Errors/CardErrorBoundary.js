import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../ui/components';

class CardErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error) {
    this.setState({ error });
    console.log(error); // eslint-disable-line no-console
  }

  canAcknowledge = () => !!this.props.onAcknowledge;

  handleAcknowledge = this.props.onAcknowledge;

  render() {
    const { error } = this.state;

    if (error) {
      return (
        <div className="error">
          <div className="error__layout">
            <h1 className="error__title">Something went wrong.</h1>
            <div className="error__message">
              { error.message && <p>{error.message}</p> }
              { this.canAcknowledge() &&
                <Button
                  size="small"
                  color="platinum"
                  onClick={this.handleAcknowledge}
                >OK</Button>
              }
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
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
