import React from 'react';
import PropTypes from 'prop-types';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { Section, Row } from '@components/EditorLayout';
import { getFieldId } from '../../../utils/issues';
import ValidatedField from '../../Form/ValidatedField';
import AssignAttributes from '../../AssignAttributes';
import Tip from '../../Tip';

const PromptFields = ({
  form,
  entity,
  type,
}) => (
  <>
    <Section>
      <Row>
        <h3 id={getFieldId('text')}>Prompt Text</h3>
        <p>
          The prompt text instructs your participant about the task on this stage.
          Enter the text to use for your prompt below.
        </p>
        <Tip>
          <p>
            You can use markdown formatting in this prompt to create bold or underlined text.
          </p>
        </Tip>
        <ValidatedField
          name="text"
          component={Fields.Text}
          label=""
          placeholder="Enter text for the prompt here..."
          validation={{ required: true, maxLength: 220 }}
        />
      </Row>
    </Section>
    <Section>
      <Row>
        <h3>
          Assign Additional Variables?
          <small>(optional)</small>
        </h3>
        <p>
          This feature allows you to assign a variable and associated value to
          any nodes created on this prompt. You can use this to
          keep track of where a node was elicited, or to reflect a name interpreter element of
          your prompt. For example, if you have a prompt that asks &apos;Who are you
          close to?&apos;, you could add an additional variable called close_tie
          and set it to true. You could then use this variable in your skip logic or
          stage filtering rules.
        </p>
        <Tip>
          <p>
            Select an existing variable, or select &quot;create new variable&quot;
            from the bottom of the list, and then assign a value. You can set different values
            for this variable for nodes created on different prompts.
          </p>
        </Tip>

        <AssignAttributes
          name="additionalAttributes"
          id="additionalAttributes"
          form={form}
          type={type}
          entity={entity}
        />
      </Row>
    </Section>
  </>
);

PromptFields.propTypes = {
  type: PropTypes.string,
  entity: PropTypes.string,
  form: PropTypes.string.isRequired,
};

PromptFields.defaultProps = {
  type: null,
  entity: null,

};

export default PromptFields;
