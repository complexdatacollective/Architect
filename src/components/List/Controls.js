import React, { Component } from 'react';
import PropTypes from 'prop-types';

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

  updateParameter(parameter) {
    this.setState(parameter);
    this.props.onChange(parameter);
  }

  render() {
    const { sortFields } = this.props;
    const { sortOrder } = this.state;

    return (
      <div>
        { sortFields && sortFields.map(
          (field) => {
            const optionIndex = sortOrder.findIndex(property => property === field);
            const option = optionIndex ?
              sortOrder[optionIndex] :
              { property: field, direction: 'asc' };

            const toggleSort = () => this.updateParameter({
              sortOrder: Object.assign([], sortOrder, { [optionIndex]: !option.directon }),
            });

            return (
              <Button
                // color={this.state.activeSortOrder.property === sortField.variable ? 'primary' : 'white'}
                key={field}
                onClick={toggleSort}
              >
                {field} {option.direction}
              </Button>
            );
          },
        )}

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
