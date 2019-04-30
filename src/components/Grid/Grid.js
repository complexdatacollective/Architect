import React, { Component } from 'react';
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

  render() {
    const {
      items,
      capacity,
      previewComponent,
      fields,
    } = this.props;

    return (
      <GridLayout
        className="layout grid"
        layout={getLayout(items, capacity)}
        cols={1}
        rowHeight={100}
        width={500}
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
              {...rest}
            />
          </div>
        ))}
      </GridLayout>
    );
  }
}

export { Grid };

export default withItems(Grid);
