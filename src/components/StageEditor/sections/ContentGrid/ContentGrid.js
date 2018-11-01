import React, { Component } from 'react';
import uuid from 'uuid';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  FieldArray,
  arrayPush,
  change,
  formValueSelector,
  getFormSyncErrors,
} from 'redux-form';
import Guidance from '../../../Guidance';
import { Items, NewButton } from '../../../Items';
import Item from './Item';
import { units, capacity, sizes } from './sizes';

class ContentGrid extends Component {
  static propTypes = {
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);

    this.state = {
      editing: {},
    };
  }

  editItem = (itemId) => {
    if (!this.state.editing[itemId]) {
      this.setState({ editing: { ...this.state.editing, [itemId]: true } });
      return;
    }

    // If we're already editing it then act like a toggle
    this.setState({ editing: { ...this.state.editing, [itemId]: false } });
  };

  handleToggleItemEdit = (itemId) => {
    this.editItem(itemId);
  };

  handleChooseItemType = (fieldId, type) =>
    this.props.setInputType(fieldId, type);

  handleCreateItem = () => {
    const itemId = this.props.createNewItem();
    this.editItem(itemId);
  };

  render() {
    const { form, spareCapacity } = this.props;

    return (
      <Guidance contentId="guidance.editor.content_items">
        <div className="stage-editor-section">

          <h2>Content Boxes</h2>
          <p>
            Use this section to configure up to three content boxes, containing images, video, 
            audio, or text.
          </p>
          <div className="content-grid">
            <FieldArray
              name="items"
              component={Items}
              itemComponent={Item}
              onToggleItemEdit={this.handleToggleItemEdit}
              onChooseItemType={this.handleChooseItemType}
              editing={this.state.editing}
              form={form}
              errors={this.props.errors}
              spareCapacity={spareCapacity}
            />
          </div>

          { spareCapacity > 0 &&
            <NewButton
              onClick={this.handleCreateItem}
            />
          }
        </div>
      </Guidance>
    );
  }
}

ContentGrid.propTypes = {
  createNewItem: PropTypes.func.isRequired,
  spareCapacity: PropTypes.number.isRequired,
  setInputType: PropTypes.func.isRequired,
  form: PropTypes.shape({
    name: PropTypes.string,
    getValues: PropTypes.func,
  }).isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state, { form }) => {
  const items = formValueSelector(form.name)(state, 'items') || [];

  const spareCapacity = items.reduce(
    (memo, item) =>
      memo - (item.size ? units[item.size] : 0),
    capacity,
  );

  const errors = getFormSyncErrors(form.name)(state);

  return {
    spareCapacity,
    errors,
  };
};

const mapDispatchToProps = (dispatch, { form }) => ({
  createNewItem: () => {
    const itemId = uuid();
    dispatch(arrayPush(form.name, 'items', { id: itemId, size: sizes.SMALL }));
    return itemId;
  },
  setInputType: (fieldId, type) => dispatch(change(form.name, `${fieldId}.type`, type)),
});

export { ContentGrid };

export default connect(mapStateToProps, mapDispatchToProps)(ContentGrid);
