import React, { Component } from 'react';
import GridLayout from 'react-grid-layout';
import { connect } from 'react-redux';
import { Flipped } from 'react-flip-toolkit';
import { formValueSelector } from 'redux-form';

const mapStateToProps = (state, { form, fields }) => {
  const items = formValueSelector(form)(state, fields.name);
  const itemCount = items ? items.length : 0;

  return {
    itemCount,
    items,
  };
};

const getLayout = (items) => {
  const remainingSpace = items.reduce(
    (acc, { size }) => acc - size,
    8,
  );

  return items.reduce(
    (memo, { id, size }, index) => {
      const y = memo.reduce((acc, { h }) => acc + h, 0);

      return [
        ...memo,
        {
          i: id,
          y,
          w: 1,
          h: size,
          x: index,
          maxH: (remainingSpace - size),
        },
      ];
    },
    [],
  );
};

class Grid extends Component {
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

  renderItem = ({ id, ...rest }, index) => {
    const {
      fields,
      editField,
      onEditItem,
      item: ItemComponent,
    } = this.props;

    const fieldId = `${fields.name}[${index}]`;
    const flipId = editField === fieldId ? `_${fieldId}` : fieldId;

    return (
      <div key={id} className="grid__item">
        <Flipped flipId={flipId}>
          <ItemComponent
            id={id}
            onDelete={() => fields.remove(index)}
            onEdit={() => onEditItem(fieldId)}
            {...rest}
          />
        </Flipped>
      </div>
    );
  };
  render() {
    const {
      items,
    } = this.props;

    return (
      <GridLayout
        className="layout grid"
        layout={getLayout(items)}
        cols={1}
        rowHeight={50}
        width={500}
        onDragStop={this.onDragStop}
        onResizeStop={this.onResizeStop}
      >
        {items.map(this.renderItem)}
      </GridLayout>
    );
  }
}

export { Grid };

export default connect(
  mapStateToProps,
)(Grid);
