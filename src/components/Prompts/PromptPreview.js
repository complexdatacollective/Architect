import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Flipped } from 'react-flip-toolkit';
import { Item, Row } from '../OrderedList';

class PromptPreview extends PureComponent {
  render() {
    const {
      onClickPrompt,
      editField,
      fieldId,
      ...rest
    } = this.props;

    if (editField === fieldId) return null;

    return (
      <Flipped flipId={fieldId}>
        {flipProps => (
          <Item {...flipProps} {...rest}>
            <Row onClick={() => onClickPrompt(fieldId)}>
              <Flipped inverseFlipId={fieldId} scale>
                <div>
                  {this.preview && this.preview()}
                </div>
              </Flipped>
            </Row>
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
