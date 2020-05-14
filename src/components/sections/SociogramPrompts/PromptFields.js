import React from 'react';
import { compose } from 'recompose';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { Section } from '@components/EditorLayout';
import { getFieldId } from '../../../utils/issues';
import { ValidatedField } from '../../Form';
import FieldsLayout from './PromptFieldsLayout';
import FieldsHighlight from './PromptFieldsHighlight';
import FieldsEdges from './PromptFieldsEdges';
import withCanCreateEdgesState from './withCanCreateEdgesState';
import Tip from '../../Tip';

const PromptFields = props => (
  <div>
    <Section contentId="guidance.editor.sociogram_prompt.text">
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
    </Section>
    <FieldsLayout {...props} />
    <FieldsEdges {...props} />
    <FieldsHighlight {...props} />
  </div>
);

export { PromptFields };

export default compose(
  withCanCreateEdgesState,
)(PromptFields);
