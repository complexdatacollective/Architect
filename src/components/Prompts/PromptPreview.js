import React from 'react';
import PropTypes from 'prop-types';
import { Flipped } from 'react-flip-toolkit';
import { Item, Row } from '../OrderedList';

const PromptPreview = ({
  onClickPrompt,
  editField,
  fieldId,
  children,
}) => {
  // Intentionally mis-match ids when 'opening' prompt, to stop it being removed from the screen.
  const flipId = editField === fieldId ? `_${fieldId}` : fieldId;

  return (
    <Flipped flipId={flipId}>
      {flipProps => (
        <Item {...flipProps} >
          <Row onClick={() => onClickPrompt(fieldId)}>
            <Flipped inverseFlipId={fieldId} scale>
              <div>
                {children}
              </div>
            </Flipped>
          </Row>
        </Item>
      )}
    </Flipped>
  );
};

PromptPreview.propTypes = {
  fieldId: PropTypes.string.isRequired,
};

export { PromptPreview };

export default PromptPreview;
