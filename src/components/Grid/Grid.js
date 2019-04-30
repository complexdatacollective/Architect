import React, { Component } from 'react';
import GridLayout from 'react-grid-layout';
import { connect } from 'react-redux';
import { Flipped } from 'react-flip-toolkit';
import { formValueSelector } from 'redux-form';
import Icon from '../../ui/components/Icon';

const mapStateToProps = (state, { form, fields }) => {
  const items = formValueSelector(form)(state, fields.name);
  const itemCount = items ? items.length : 0;

  return {
    itemCount,
    items,
  };
};

const getLayout = (items = []) => {
  const capacity = 4;

  const remainingSpace = items.reduce(
    (acc, { size }) => acc - size,
    capacity,
  );

  const layout = items.reduce(
    (memo, { id, size }, index) => {
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
  static defaultProps = {
    items: [],
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
          <div className="content-grid-preview">
            <div className="content-grid-preview__content">
              <ItemComponent id={id} {...rest} />
            </div>
            <div
              className="content-grid-preview__edit"
              onClick={() => onEditItem(fieldId)}
            ><Icon name="edit" /></div>
            <div
              className="content-grid-preview__delete"
              onClick={() => fields.remove(index)}
            ><Icon name="delete" /></div>
          </div>
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
