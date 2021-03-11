import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Flipped } from 'react-flip-toolkit';
import { Item } from '../OrderedList';

class Preview extends Component {
  render() {
    const {
      onClickPrompt,
      editField,
      fieldId,
      onDelete,
      sortable,
    } = this.props;

    // Switch out flipId when fields match to prevent removal
    // from DOM but still allow FLIP to work
    const flipId = editField === fieldId ? `_${fieldId}` : fieldId;

    const handleClick = () => onClickPrompt(fieldId);

    return (
      <Flipped flipId={flipId}>
        {(flipProps) => (
          <Item
            {...flipProps}
            sortable={sortable}
            onDelete={onDelete}
            onClick={handleClick}
          >
            <Flipped inverseFlipId={fieldId} scale>
              <div className="editable-list-preview">
                {this.preview && this.preview()}
              </div>
            </Flipped>
          </Item>
        )}
      </Flipped>
    );
  }
}

Preview.propTypes = {
  fieldId: PropTypes.string.isRequired,
  sortable: PropTypes.bool,
  onClickPrompt: PropTypes.func.isRequired,
  editField: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

Preview.defaultProps = {
  sortable: true,
};

export { Preview };

export default Preview;
