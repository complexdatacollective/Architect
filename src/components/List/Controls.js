import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SortControl from './SortControl';

class Controls extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
      sortOrder: [],
    };
  }

  handleUpdateQuery = (event) => {
    const query = event.target.value;

    this.updateParameter({ query });
  }

  handleUpdateSortOrder = (sortOrder) => {
    this.updateParameter({ sortOrder });
  }

  updateParameter(parameter) {
    this.setState(parameter);
    this.props.onChange(parameter);
  }

  render() {
    return (
      <div>
        <SortControl
          sortableFields={this.props.sortableFields}
          sortOrder={this.state.sortOrder}
          onChange={this.handleUpdateSortOrder}
        />
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
  sortableFields: [],
};

export default Controls;
