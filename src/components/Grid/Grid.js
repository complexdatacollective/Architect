import React, { Component } from 'react';
import { throttle } from 'lodash';
import PropTypes from 'prop-types';
import cx from 'classnames';
import GridLayout from 'react-grid-layout';
import Icon from '@codaco/ui/lib/components/Icon';
import GridItem from './GridItem';
import withItems from './withItems';
import {
  trimSize,
  convertSize,
  getLayout,
} from './helpers';

class Grid extends Component {
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

  setWidth = throttle((width) => {
    this.setState({ width });
  }, 500);

  handleDragStop = (layout, from) => {
    const { fields, items } = this.props;
    const newOrder = layout
      .sort((a, b) => a.y - b.y)
      .map(({ i }) => i);
    const oldIndex = items.findIndex(({ id }) => id === from.i);
    const newIndex = newOrder.indexOf(from.i);
    if (oldIndex === newIndex) { return; }
    fields.swap(oldIndex, newIndex);
  };

  handleResizeStop = (layout, from, to) => {
    const { fields, items, capacity } = this.props;
    const index = items.findIndex(({ id }) => id === from.i);
    const size = convertSize(trimSize(from.h, to.h, items, capacity));

    const newItem = {
      ...items[index],
      size,
    };
    fields.splice(index, 1, newItem);
  };

  checkSize = () => {
    const { width } = this.state;
    if (!this.ref.current) { return; }

    const nextWidth = this.ref.current.parentElement.offsetWidth;

    if (width !== nextWidth) {
      this.setWidth(nextWidth);
    }
  };

  render() {
    const {
      items,
      capacity,
      previewComponent,
      onEditItem,
      fields,
      meta,
      editField,
    } = this.props;

    const { error, submitFailed } = meta;

    const { width } = this.state;

    const gridClasses = cx(
      'grid',
      {
        'grid--has-error': submitFailed && error,
      },
    );

    if (!items) {
      return (
        <div className="grid">
          <p><em>Currently no items.</em></p>
        </div>
      );
    }

    return (
      <div className={gridClasses} ref={this.ref}>
        <GridLayout
          className="layout"
          layout={getLayout(items, capacity)}
          cols={1}
          rowHeight={100}
          autoSize={false}
          height={500}
          width={width}
          onDragStop={this.handleDragStop}
          onResizeStop={this.handleResizeStop}
          onLayoutChange={this.handleLayoutChange}
        >
          {items.map(({ id, ...item }, index) => (
            <div key={id} className="grid__item">
              <GridItem
                id={id}
                index={index}
                fields={fields}
                previewComponent={previewComponent}
                onEditItem={onEditItem}
                editField={editField}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...item}
              />
            </div>
          ))}
        </GridLayout>

        { submitFailed && error
          && (
          <p className="grid__error">
            <Icon name="warning" />
            {' '}
            {error}
          </p>
          )}
      </div>
    );
  }
}

Grid.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  fields: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  items: PropTypes.array.isRequired,
  capacity: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  previewComponent: PropTypes.any.isRequired,
  onEditItem: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  meta: PropTypes.object.isRequired,
  editField: PropTypes.string,
};

Grid.defaultProps = {
  editField: '',
};

export default withItems(Grid);
