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

    if (editField === fieldId) return null;

    const handleClick = () => onClickPrompt(fieldId);

    return (
      <Flipped flipId={fieldId}>
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
