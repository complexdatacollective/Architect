import React, { Component } from 'react';
import cx from 'classnames';
import { toPairs } from 'lodash';
import Controls from './Controls';

/*

var options = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    "title",
    "author.firstName"
]
};
var fuse = new Fuse(list, options); // "list" is the item array
var result = fuse.search("steve");
*/

class List extends Component {
  static defaultProps = {
    controls: Controls,
    filter: () => items => items,
  };

  constructor(props) {
    super(props);

    this.state = {
      parameters: {},
    };
  }

  handleUpdateParameters = (parameters) => {
    this.setState({ parameters });
  }

  items() {
    const { items, filter } = this.props;
    const { parameters } = this.state;

    const withIndices = toPairs(items);
    const filterFunc = filter(parameters);

    const filteredItems = withIndices.filter(([, item]) => filterFunc(item));
    // filterFunc(withIndices)

    // debugger;

    return filteredItems;
  }

  render() {
    const {
      controls: Controls,
      component: Component,
      className,
    } = this.props;

    return (
      <div className={cx(className)}>
        { Controls &&
          <Controls onChange={this.handleUpdateParameters} />
        }
        <div className="list__items">
          {this.items().map(
            ([index, item]) =>
              <Component item={item} index={index} key={JSON.stringify(item)} />,
          )}
        </div>
      </div>
    );
  }
}

export default List;
