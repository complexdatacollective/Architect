import React from 'react';
import PropTypes from 'prop-types';
import { Flipped } from 'react-flip-toolkit';
import { ValidatedField } from '../../../Form';
import TextArea from '../../../../ui/components/Fields/TextArea';
import AttributesTable from '../../../AttributesTable';
import { Item, Row } from '../../../OrderedList';
import { getFieldId } from '../../../../utils/issues';

const NameGeneratorPrompt = ({ onClickPrompt, isEditing, handleValidateAttributes, fieldId, form, nodeType, ...rest }) => (
  <div>
      <Flipped flipId={isEditing ? null : fieldId}>
        {flipProps => (
          <Item {...rest} {...flipProps}>
            <div onClick={() => onClickPrompt(fieldId)}>
              click me
            </div>
            <Row>
              <div id={getFieldId(`${fieldId}.text`)} data-name="Prompt text" />
              <h3>Text for Prompt</h3>
              <ValidatedField
                name={`${fieldId}.text`}
                component={TextArea}
                className="stage-editor-section-prompt__textarea"
                label=""
                placeholder="Enter text for the prompt here"
                validation={{ required: true }}
              />
            </Row>
            <Row>
              <div id={getFieldId(`${fieldId}.additionalAttributes`)} data-name="Prompt additional attributes" />
              <h3>Additional attributes</h3>
              <AttributesTable
                name={`${fieldId}.additionalAttributes`}
                id="additionalAttributes"
                nodeType={nodeType}
              />
            </Row>
          </Item>
        )}
      </Flipped>
  </div>
);

NameGeneratorPrompt.propTypes = {
  fieldId: PropTypes.string.isRequired,
  form: PropTypes.shape({
    name: PropTypes.string,
    getValues: PropTypes.func,
  }).isRequired,
  nodeType: PropTypes.string,
};

NameGeneratorPrompt.defaultProps = {
  nodeType: null,
};

export { NameGeneratorPrompt };

export default NameGeneratorPrompt;
