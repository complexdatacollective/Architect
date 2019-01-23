import React from 'react';
import PropTypes from 'prop-types';
import TextArea from '../../../../ui/components/Fields/TextArea';
import { getFieldId } from '../../../../utils/issues';
import { ValidatedField } from '../../../Form';
import AttributesTable from '../../../AttributesTable';
import { Row } from '../../../OrderedList';
import Form from '../../../Prompts/PromptForm';

class PromptForm extends Form {
  form() {
    const {
      fieldId,
      nodeType,
    } = this.props;

    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  }
}

PromptForm.propTypes = {
  fieldId: PropTypes.string.isRequired,
  onComplete: PropTypes.func.isRequired,
  nodeType: PropTypes.string,
};

PromptForm.defaultProps = {
  nodeType: null,
};

export { PromptForm };

export default PromptForm;
