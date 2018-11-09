import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../ui/components';

class SortControl extends Component {
  getSortOption(property) {
    const { sortOrder } = this.props;

    const optionIndex = sortOrder.findIndex(sortRule => sortRule.property === property);

    if (optionIndex === -1) {
      return [
        { property, direction: 'asc' },
        sortOrder.length,
      ];
    }

    return [
      sortOrder[optionIndex],
      optionIndex,
    ];
  }

  toggleSort = (property) => {
    const { sortOrder } = this.props;

    const [option, optionIndex] = this.getSortOption(property);

    const newDirection = option.direction === 'desc' ? 'asc' : 'desc';

    const newSortOrder = Object.assign(
      [],
      sortOrder,
      { [optionIndex]: { ...option, direction: newDirection } },
    );

    this.props.onChange(newSortOrder);
  }

  render() {
    const { sortableFields } = this.props;

    if (!sortableFields) { return null; }

    return sortableFields.map(
      (field) => {
        const [option] = this.getSortOption(field);

        return (
          <Button
            // color={this.state.activeSortOrder.property === sortField.variable ? 'primary' : 'white'}
            type="button"
            key={field}
            onClick={() => this.toggleSort(field)}
          >
            {field} {option.direction}
          </Button>
        );
      },
    );
  }
}

SortControl.propTypes = {
  onChange: PropTypes.func,
  sortableFields: PropTypes.array,
  sortOrder: PropTypes.array,
};

SortControl.defaultProps = {
  onChange: () => {},
  sortableFields: [],
  sortOrder: [],
};

export default SortControl;
