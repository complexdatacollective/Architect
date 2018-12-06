import React, { Component } from 'react';
import { map } from 'lodash';
import DefaultControls from './Controls';

class List extends Component {
  static defaultProps = {
    controls: DefaultControls,
    filter: items => items,
    onDelete: () => {},
    initialSortOrder: {},
  };

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

  items() {
    const { items, filter } = this.props;
    const { parameters } = this.state;

    const withIndices = map(items, (item, _index) => ({ ...item, _index }));

    return filter(withIndices, parameters);
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
          {this.items().map(({ _index, ...item }) => (
            <div className="list__item" key={_index}>
              <Item
                item={item}
                {...rest}
                index={_index}
                sortable={false}
                onDelete={() => onDelete(_index)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default List;
