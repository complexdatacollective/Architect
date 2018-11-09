import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../ui/components';

const getDirectionLabel = direction =>
  (direction === 'asc' ? '\u25B2' : '\u25BC');

class SortControl extends Component {
  getIsSorted(checkedProperty) {
    return this.props.sortOrder
      .map(({ property }) => property)
      .includes(checkedProperty);
  }

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
    const { sortableProperties } = this.props;

    if (!sortableProperties) { return null; }

    return sortableProperties.map(
      (property) => {
        const [option] = this.getSortOption(property);
        const isSorted = this.getIsSorted(property);
        const color = isSorted ? 'white' : 'primary';
        const label = isSorted ?
          `${property} ${getDirectionLabel(option.direction)}` :
          property;

        return (
          <Button
            color={color}
            type="button"
            key={property}
            onClick={() => this.toggleSort(property)}
          >
            {label}
          </Button>
        );
      },
    );
  }
}

SortControl.propTypes = {
  onChange: PropTypes.func,
  sortableProperties: PropTypes.array,
  sortOrder: PropTypes.array,
};

SortControl.defaultProps = {
  onChange: () => {},
  sortableProperties: [],
  sortOrder: [],
};

export default SortControl;
