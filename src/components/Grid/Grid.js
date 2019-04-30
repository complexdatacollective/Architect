import React, { Component } from 'react';
import { throttle } from 'lodash';
import PropTypes from 'prop-types';
import GridLayout from 'react-grid-layout';
import GridItem from './GridItem';
import withItems from './withItems';

const getLayout = (items = [], capacity = 4) => {
  const remainingSpace = items.reduce(
    (acc, { size }) => acc - size,
    capacity,
  );

  const layout = items.reduce(
    (memo, { id, size }) => {
      const y = memo.reduce((acc, { h }) => acc + h, 0);
      const h = size || 1;
      const maxH = h + remainingSpace;

      return [
        ...memo,
        {
          i: id,
          y,
          w: 1,
          h,
          x: 0,
          maxH,
        },
      ];
    },
    [],
  );

  return layout;
};

class Grid extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    this.ref = React.createRef();
    this.state = {
      width: 100,
    };
  }

  componentDidMount() {
    this.resizeSensor = setInterval(this.checkSize, 50);
  }

  componentWillUnmount() {
    clearInterval(this.resizeSensor);
  }

  onDragStop = (layout, from) => {
    const { fields, items } = this.props;
    const newOrder = layout
      .sort((a, b) => a.y - b.y)
      .map(({ i }) => i);
    const oldIndex = items.findIndex(({ id }) => id === from.i);
    const newIndex = newOrder.indexOf(from.i);
    if (oldIndex === newIndex) { return; }
    fields.swap(oldIndex, newIndex);
  };

  onResizeStop = (layout, from, to) => {
    const { fields, items } = this.props;
    const index = items.findIndex(({ id }) => id === from.i);
    const newItem = {
      ...items[index],
      size: to.h,
    };
    fields.splice(index, 1, newItem);
  };

  setWidth = throttle((width) => {
    this.setState({ width });
  }, 500);

  checkSize = () => {
    if (!this.ref.current) { return; }

    const width = this.ref.current.parentElement.offsetWidth;

    if (this.state.width !== width) {
      this.setWidth(width);
    }
  };

  render() {
    const {
      items,
      capacity,
      previewComponent,
      onEditItem,
      fields,
    } = this.props;

    if (!items) { return null; }

    return (
      <div ref={this.ref}>
        <GridLayout
          className="layout grid"
          layout={getLayout(items, capacity)}
          cols={1}
          rowHeight={100}
          width={this.state.width}
          onDragStop={this.onDragStop}
          onResizeStop={this.onResizeStop}
        >
          {items.map(({ id, ...rest }, index) => (
            <div key={id} className="grid__item">
              <GridItem
                id={id}
                index={index}
                fields={fields}
                previewComponent={previewComponent}
                onEditItem={onEditItem}
                {...rest}
              />
            </div>
          ))}
        </GridLayout>
      </div>
    );
  }
}

export { Grid };

export default withItems(Grid);
