import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ItemPreview from './ItemPreview';
import ItemChooser from './ItemChooser';
import ItemEditor from './ItemEditor';

class Item extends Component {
  static propTypes = {
    itemOptions: PropTypes.array,
    name: PropTypes.string,
    type: PropTypes.string,
    isEditing: PropTypes.bool,
    onToggleEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onChooseItemType: PropTypes.func.isRequired,
  };

  static defaultProps = {
    itemOptions: [],
    isEditing: false,
    type: null,
    value: null,
    name: null,
  };

  get isNew() {
    return true;
  }

  render() {
    const {
      itemOptions,
      name,
      type,
      isEditing,
      onToggleEdit,
      onDelete,
      onChooseItemType,
    } = this.props;

    const variableClasses = cx(
      'content-grid-item',
      { 'content-grid-item--edit': isEditing },
      { 'content-grid-item--new': this.isNew },
    );

    return (
      <div
        className={variableClasses}
        onClick={onToggleEdit}
      >
        { !this.isNew &&
          <div className="content-grid-item__preview">
            <ItemPreview name={name} onDelete={onDelete} />
          </div>
        }

        <div className="content-grid-item__edit">
          <ItemChooser
            show={this.isNew}
            onChooseItemType={onChooseItemType}
            itemOptions={itemOptions}
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

export { Item };

export default Item;
