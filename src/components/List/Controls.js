import React, { Component } from 'react';
import cx from 'classnames';

class Controls extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
    };
  }

  handleUpdateQuery = (event) => {
    const query = event.target.value;
    console.log({ query });

    this.updateParameter({ query });
  }

  updateParameter(parameter) {
    this.setState(parameter);
    this.props.onChange(parameter);
  }

  render() {
    const {
      className,
    } = this.props;

    return (
      <div className={cx(className)}>
        <input
          type="text"
          value={this.state.query}
          onChange={this.handleUpdateQuery}
        />
      </div>
    );
  }
}

export default Controls;
