import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DefaultControls from './Controls';

class List extends Component {
  constructor(props) {
    super(props);

    const { initialSortOrder } = this.props;

    this.state = {
      parameters: {
        sortOrder: initialSortOrder,
      },
    };
  }

  handleUpdateParameters = (parameters) => {
    this.setState((prevState) => ({
      parameters: {
        ...prevState.parameters,
        ...parameters,
      },
    }));
  }

  filteredItems() {
    const { items, filter } = this.props;
    const { parameters } = this.state;

    return filter(items, parameters);
  }

  render() {
    const {
      controls: Controls,
      item: Item,
      sortableProperties,
      initialSortOrder,
      onDelete,
      children,
      items,
      filter,
      ...rest
    } = this.props;

    return (
      <div className="list">
        { children }
        { Controls && (
          <div className="list__controls">
            <Controls
              onChange={this.handleUpdateParameters}
              sortableProperties={sortableProperties}
              initialSortOrder={initialSortOrder}
            />
          </div>
        )}
        <div className="list__items">
          {this.filteredItems().map(({ fieldId, index, ...item }) => (
            <div className="list__item" key={item.id || fieldId}>
              <Item
                sortable={false}
                onDelete={() => onDelete(index)}
                fieldId={fieldId}
                {...rest}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

List.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  initialSortOrder: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  items: PropTypes.array.isRequired,
  filter: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  controls: PropTypes.any,
  // eslint-disable-next-line react/forbid-prop-types
  item: PropTypes.any.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  sortableProperties: PropTypes.any,
  onDelete: PropTypes.func,
  children: PropTypes.node,
};

List.defaultProps = {
  children: null,
  controls: DefaultControls,
  sortableProperties: [],
  filter: (items) => items,
  onDelete: () => {},
};

export default List;
