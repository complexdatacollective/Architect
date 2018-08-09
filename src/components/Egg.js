import React, { Component } from 'react';
import PropTypes from 'prop-types';

const defaultCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

class Egg extends Component {
  constructor(props) {
    super(props);

    this.state = {
      success: false,
      progress: 0,
    };
  }

  componentDidMount() {
    document.addEventListener('keyup', this.onKeyUp);
  }

  onKeyUp = (e) => {
    const { progress } = this.state;
    const { code } = this.props;

    const keyCode = e.keyCode;

    if (keyCode !== code[progress]) {
      this.setState({ progress: 0, success: false });
      return;
    }

    this.setState({ progress: progress + 1 });

    if (progress + 1 === code.length) {
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
