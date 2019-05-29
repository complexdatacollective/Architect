import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { getFieldId } from '../../../utils/issues';
import Text from '../../../ui/components/Fields/Text';
import ValidatedField from '../../Form/ValidatedField';
import AssignAttributes from '../../AssignAttributes';
import Row from '../Row';
import Section from '../Section';

class PromptFields extends PureComponent {
  render() {
    const {
      type,
      entity,
      form,
    } = this.props;

    return (
      <Section>
        <Row>
          <h3 id={getFieldId('text')}>Prompt Text</h3>
          <p>
            The prompt text instructs your participant about the task on this stage.
            Enter the text to use for your prompt below.
          </p>
          <p><strong>
            Tip: You can use markdown formatting in this prompt to create bold or underlined text.
          </strong></p>
          <ValidatedField
            name="text"
            component={Text}
            className="stage-editor-section-prompt__textarea"
            label=""
            placeholder="Enter text for the prompt here..."
            validation={{ required: true, maxLength: 220 }}
          />
        </Row>
        <Row>
          <h3>Assign Additional Variables? <small>(optional)</small></h3>
          <p>
            You might also wish to assign additional variables to any nodes that are created by a
            participant on this prompt. You can use this feature to keep track of meta-data,
            such as where a node was elicited, or to reflect a name interpreter element of
            your prompt (for example by adding a variable called &quot;close_tie&quot; to a
            prompt that asks about closeness).
          </p>
          <p>
            <strong>Tip: Select an existing variable, or select &quot;create new variable&quot;
            from the bottom of the list, and then assign a value. You can set different values
            for this variable for nodes created on different prompts.</strong>
          </p>
          <AssignAttributes
            form={form}
            name="additionalAttributes"
            id="additionalAttributes"
            type={type}
            entity={entity}
          />
        </Row>
      </Section>
    );
  }
}

PromptFields.propTypes = {
  type: PropTypes.string,
  entity: PropTypes.string,
  form: PropTypes.string.isRequired,
};

PromptFields.defaultProps = {
  type: null,
  entity: null,
};

export { PromptFields };

export default PromptFields;
