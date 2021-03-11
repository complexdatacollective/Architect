import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@codaco/ui/lib/components';

const getDirectionLabel = (direction) => (direction === 'asc' ? '\u25B2' : '\u25BC');

class SortControl extends Component {
  getIsSorted(checkedProperty) {
    const { sortOrder: { property } } = this.props;
    return property === checkedProperty;
  }

  toggleSort = (property) => {
    const { sortOrder, onChange } = this.props;
    const option = sortOrder;
    const newDirection = option.direction === 'desc' ? 'asc' : 'desc';
    const newSortOrder = {
      property,
      direction: newDirection,
    };

    onChange(newSortOrder);
  }

  renderButton = (property) => {
    const { sortOrder } = this.props;
    const isSorted = this.getIsSorted(property);
    const color = isSorted ? 'primary' : 'platinum';
    const label = isSorted
      ? `${property} ${getDirectionLabel(sortOrder.direction)}`
      : property;

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
  }

  render() {
    const { sortableProperties } = this.props;

    if (!sortableProperties) { return null; }

    return (
      <div className="list-sort-control">
        {sortableProperties.map(this.renderButton)}
      </div>
    );
  }
}

SortControl.propTypes = {
  onChange: PropTypes.func,
  sortableProperties: PropTypes.array,
  sortOrder: PropTypes.object,
};

SortControl.defaultProps = {
  onChange: () => {},
  sortableProperties: [],
  sortOrder: {},
};

export default SortControl;
