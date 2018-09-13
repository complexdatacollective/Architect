import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ItemPreview from './ItemPreview';
import ItemChooser from './ItemChooser';
import ItemEditor from './ItemEditor';
import { sizes } from './sizes';

class Item extends Component {
  static propTypes = {
    fieldId: PropTypes.string.isRequired,
    editing: PropTypes.string,
    onToggleItemEdit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    onChooseItemType: PropTypes.func.isRequired,
    item: PropTypes.shape({
      content: PropTypes.string,
      type: PropTypes.string,
      size: PropTypes.oneOf([sizes.SMALL, sizes.MEDIUM, sizes.LARGE]),
    }),
    spareCapacity: PropTypes.number,
  };

  static defaultProps = {
    editing: false,
    item: {
      content: null,
      type: null,
      size: null,
    },
    spareCapacity: 0,
  };

  get item() {
    return this.props.item;
  }

  get isNew() {
    return !this.item.type;
  }

  get isEditing() {
    return this.item.id === this.props.editing;
  }

  handleChooseItemType = type =>
    this.props.onChooseItemType(this.props.fieldId, type);

  handleToggleItemEdit = () => {
    this.props.onToggleItemEdit(this.item.id);
  }

  render() {
    const {
      fieldId,
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
            <ItemPreview
              content={this.item.content}
              type={this.item.type}
              size={this.item.size}
              onDeleteItem={handleDelete}
            />
          </div>
        }

        <div className="content-grid-item__edit">
          <ItemChooser
            show={this.isNew}
            onChooseItemType={this.handleChooseItemType}
          />
          <ItemEditor
            show={!this.isNew}
            name={fieldId}
            type={this.item.type}
            size={this.item.size}
            spareCapacity={spareCapacity}
            onComplete={this.handleToggleItemEdit}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, { fieldId, form }) => ({
  item: form.getValues(state, `${fieldId}`),
});

export { Item };

export default connect(mapStateToProps)(Item);
