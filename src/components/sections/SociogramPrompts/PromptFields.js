import React from 'react';
import { compose } from 'recompose';
import { getFieldId } from '../../../utils/issues';
import Guidance from '../../Guidance';
import { ValidatedField } from '../../Form';
import * as Fields from '../../../ui/components/Fields';
import Section from '../Section';
import FieldsLayout from './PromptFieldsLayout';
import FieldsHighlight from './PromptFieldsHighlight';
import FieldsEdges from './PromptFieldsEdges';
import withCanCreateEdgesState from './withCanCreateEdgesState';

const PromptFields = props => (
  <div>
    <Guidance contentId="guidance.editor.sociogram_prompt.text">
      <Section>
        <h3 id={getFieldId('text')}>Prompt text</h3>
        <p>
          Enter the text to use for your prompt below. Remember that you can add emphasis to
          your prompt using markdown syntax.
        </p>
        <ValidatedField
          name="text"
          component={Fields.TextArea}
          label=""
          placeholder="Enter text for the prompt here"
          validation={{ required: true }}
        />
      </Section>
    </Guidance>
    <FieldsLayout {...props} />
    <FieldsHighlight {...props} />
    <FieldsEdges {...props} />
  </div>
);

export { PromptFields };

export default compose(
  withCanCreateEdgesState,
)(PromptFields);
