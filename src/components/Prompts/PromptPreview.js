import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Flipped } from 'react-flip-toolkit';
import { Item } from '../OrderedList';

class PromptPreview extends PureComponent {
  render() {
    const {
      onClickPrompt,
      editField,
      fieldId,
      handleDelete,
    } = this.props;

    // Switch out flipId when fields match to prevent removal
    // from DOM but still allow FLIP to work
    const flipId = editField === fieldId ? `_${fieldId}` : fieldId;

    const handleClick = () => onClickPrompt(fieldId);

    return (
      <Flipped flipId={flipId}>
        {flipProps => (
          <Item {...flipProps} handleDelete={handleDelete} handleClick={handleClick}>
            <Flipped inverseFlipId={fieldId} scale>
              <div className="prompts-prompt-preview">
                {this.preview && this.preview()}
              </div>
            </Flipped>
          </Item>
        )}
      </Flipped>
    );
  }
}

PromptPreview.propTypes = {
  fieldId: PropTypes.string.isRequired,
};

export { PromptPreview };

export default PromptPreview;
