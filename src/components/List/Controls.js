import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Controls extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
    };
  }

  handleUpdateQuery = (event) => {
    const query = event.target.value;

    this.updateParameter({ query });
  }

  updateParameter(parameter) {
    this.setState(parameter);
    this.props.onChange(parameter);
  }

  render() {
    return (
      <div>
        <input
          type="text"
          value={this.state.query}
          onChange={this.handleUpdateQuery}
        />
      </div>
    );
  }
}

Controls.propTypes = {
  onChange: PropTypes.func,
};

Controls.defaultProps = {
  onChange: () => {},
};

export default Controls;
