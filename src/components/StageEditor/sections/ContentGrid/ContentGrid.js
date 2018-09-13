import React, { Component } from 'react';
import uuid from 'uuid';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FieldArray, arrayPush, change, formValueSelector } from 'redux-form';
import { Items, NewButton } from '../../../Items';
import Item from './Item';
import { units, capacity } from './sizes';

class ContentGrid extends Component {
  static propTypes = {
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);

    this.state = {
      editing: null,
    };
  }

  handleToggleItemEdit = (itemId) => {
    if (this.state.editing === itemId) {
      // If we're already editing it then act like a toggle
      this.setState({ editing: null });
      return;
    }
    this.setState({ editing: itemId });
  };

  handleChooseItemType = (fieldId, type) =>
    this.props.setInputType(fieldId, type);

  handleCreateItem = () => {
    const itemId = this.props.createNewItem();
    this.setState({ editing: itemId });
  };

  render() {
    const { form, spareCapacity } = this.props;

    return (
      <div className="content-grid">
        <FieldArray
          name="items"
          component={Items}
          itemComponent={Item}
          onToggleItemEdit={this.handleToggleItemEdit}
          onChooseItemType={this.handleChooseItemType}
          editing={this.state.editing}
          form={form}
          spareCapacity={spareCapacity}
        />

        { spareCapacity > 0 &&
          <NewButton
            onClick={this.handleCreateItem}
          />
        }
      </div>
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
};

const mapStateToProps = (state, { form }) => {
  const items = formValueSelector(form.name)(state, 'items') || [];
  const spareCapacity = items.reduce((memo, item) => memo - (units[item.size] || 0), capacity);

  return {
    spareCapacity,
  };
};

const mapDispatchToProps = (dispatch, { form }) => ({
  createNewItem: () => {
    const itemId = uuid();
    dispatch(arrayPush(form.name, 'items', { id: itemId }));
    return itemId;
  },
  setInputType: (fieldId, type) => dispatch(change(form.name, `${fieldId}.type`, type)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ContentGrid);
