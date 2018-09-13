import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ItemPreview from './ItemPreview';
import ItemChooser from './ItemChooser';
import ItemEditor from './ItemEditor';

class Item extends Component {
  static propTypes = {
    itemId: PropTypes.string.isRequired,
    fieldId: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    editing: PropTypes.string,
    onToggleItemEdit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    onChooseItemType: PropTypes.func.isRequired,
  };

  static defaultProps = {
    editing: false,
  };

  get isNew() {
    return !this.props.type;
  }

  get isEditing() {
    return this.props.itemId === this.props.editing;
  }

  handleChooseItemType = type =>
    this.props.onChooseItemType(this.props.fieldId, type);

  handleToggleItemEdit = () => {
    this.props.onToggleItemEdit(this.props.itemId);
  }

  render() {
    const {
      fieldId: name,
      type,
      size,
      handleDelete,
      spareCapacity,
    } = this.props;

    const variableClasses = cx(
      'content-grid-item',
      { 'content-grid-item--edit': this.isEditing },
      { 'content-grid-item--new': this.isNew },
    );

    return (
      <div
        className={variableClasses}
        onClick={this.handleToggleItemEdit}
      >
        { !this.isNew &&
          <div className="content-grid-item__preview">
            <ItemPreview name={name} onDeleteItem={handleDelete} />
          </div>
        }

        <div className="content-grid-item__edit">
          <ItemChooser
            show={this.isNew}
            onChooseItemType={this.handleChooseItemType}
          />
          <ItemEditor
            show={!this.isNew}
            name={name}
            type={type}
            size={size}
            spareCapacity={spareCapacity}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, { fieldId, form }) => {
  const item = form.getValues(state, `${fieldId}`);

  return !item ? {} : { type: item.type, size: item.size, itemId: item.id };
};

export { Item };

export default connect(mapStateToProps)(Item);
