import React, { Component } from 'react';
import PropTypes from 'prop-types';

const defaultCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

const arrayEqualLeft = (a, b) =>
  a.every((value, index) => (value === b[index]));

const arrayEqual = (a, b) =>
  a.length === b.length && arrayEqualLeft(a, b);

class Egg extends Component {
  constructor(props) {
    super(props);

    this.state = {
      success: false,
      progress: [],
    };
  }

  componentDidMount() {
    document.addEventListener('keyup', this.onKeyUp);
  }

  onKeyUp = (e) => {
    const { progress } = this.state;
    const { code } = this.props;

    const next = [...progress, e.keyCode];

    if (!arrayEqualLeft(next, code)) {
      this.setState({ progress: [], success: false });
      return;
    }

    this.setState({ progress: next });

    if (arrayEqual(code, next)) {
      this.setState({ success: true });
    }
  }

  render() {
    if (!this.state.success) { return null; }

    return <div>{this.props.children}</div>;
  }
}

Egg.propTypes = {
  children: PropTypes.node.isRequired,
  code: PropTypes.array,
};

Egg.defaultProps = {
  code: defaultCode,
};

export { Egg };

export default Egg;
