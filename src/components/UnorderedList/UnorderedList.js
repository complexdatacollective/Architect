import React, { Component } from 'react';
import { map } from 'lodash';
import DefaultControls from './Controls';

class List extends Component {
  static defaultProps = {
    controls: DefaultControls,
    filter: items => items,
    onDelete: () => {},
    onSort: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      parameters: {},
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
      onDelete,
      children,
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
            />
          </div>
        )}
        <div className="list__items">
          {this.items().map(({ _index }) => (
            <div className="list__item">
              <Item
                {...rest}
                index={_index}
                key={_index}
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
