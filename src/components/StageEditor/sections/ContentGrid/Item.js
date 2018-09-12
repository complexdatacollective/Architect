import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ItemPreview from './ItemPreview';
import ItemChooser from './ItemChooser';
import ItemEditor from './ItemEditor';

class Item extends Component {
  static propTypes = {
    name: PropTypes.string,
    type: PropTypes.string,
    isEditing: PropTypes.bool,
    onToggleEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onChooseItemType: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isEditing: false,
    type: null,
    value: null,
    name: null,
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
      onDelete,
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
            <ItemPreview name={name} onDelete={onDelete} />
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
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, { fieldId, form }) => {
  const {
    type,
    id: itemId,
  } = form.getValues(state, `${fieldId}`);

  return { type, itemId };
};

export { Item };

export default connect(mapStateToProps)(Item);
