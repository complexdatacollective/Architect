import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Item } from '../OrderedList';

class Preview extends Component {
  render() {
    const {
      onClickPrompt,
      fieldId,
      onDelete,
      sortable,
    } = this.props;

    const handleClick = () => onClickPrompt(fieldId);

    return (
      <Item
        sortable={sortable}
        onDelete={onDelete}
        onClick={handleClick}
      >
        <div className="editable-list-preview">
          {this.preview && this.preview()}
        </div>
      </Item>
    );
  }
}

Preview.propTypes = {
  fieldId: PropTypes.string.isRequired,
  sortable: PropTypes.bool,
  onClickPrompt: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

Preview.defaultProps = {
  sortable: true,
};

export default Preview;
