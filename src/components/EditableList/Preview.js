import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Flipped } from 'react-flip-toolkit';
import { Item } from '../OrderedList';

class Preview extends PureComponent {
  render() {
    const {
      onClickPrompt,
      editField,
      fieldId,
      handleDelete,
      canSort,
    } = this.props;

    // Switch out flipId when fields match to prevent removal
    // from DOM but still allow FLIP to work
    const flipId = editField === fieldId ? `_${fieldId}` : fieldId;

    const handleClick = () => onClickPrompt(fieldId);

    return (
      <Flipped flipId={flipId}>
        {flipProps => (
          <Item
            {...flipProps}
            sortable={canSort}
            handleDelete={handleDelete}
            handleClick={handleClick}
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
  canSort: PropTypes.bool,
};

Preview.defaultProps = {
  canSort: true,
};

export { Preview };

export default Preview;
