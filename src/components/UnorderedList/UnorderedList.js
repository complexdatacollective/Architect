import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DefaultControls from './Controls';

class List extends Component {
  constructor(props) {
    super(props);

    this.state = {
      parameters: {
        sortOrder: this.props.initialSortOrder,
      },
    };
  }

  handleUpdateParameters = (parameters) => {
    this.setState({ parameters: {
      ...this.state.parameters,
      ...parameters,
    } });
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
  initialSortOrder: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  filter: PropTypes.func.isRequired,
  controls: PropTypes.any.isRequired,
  item: PropTypes.any.isRequired,
  sortableProperties: PropTypes.any.isRequired,
  onDelete: PropTypes.func,
  children: PropTypes.node,
};

List.defaultProps = {
  children: null,
  controls: DefaultControls,
  filter: items => items,
  onDelete: () => {},
  initialSortOrder: {},
};


export default List;
