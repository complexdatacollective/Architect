import React from 'react';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { Section } from '@components/EditorLayout';
import { ValidatedField } from '../../Form';
import { getFieldId } from '../../../utils/issues';

const AnonymisationExplanation = () => (
  <Section
    title="Task Explanation"
    summary={(
      <p>
        Use this section to explain the anonymisation process to your participants.
      </p>
    )}
  >
    <div id={getFieldId('title')} data-name="Page Heading" />
    <ValidatedField
      label="Title"
      name="explanationText.title"
      component={Fields.Text}
      placeholder="This interview uses enhanced privacy protection"
      validation={{ required: true }}
      maxLength="50"
    />
    <ValidatedField
      label="Body"
      name="explanationText.body"
      component={Fields.RichText}
      placeholder="Enter your passphrase below, and click the 'continue' button."
      validation={{ required: true }}
    />
  </Section>
);

export default AnonymisationExplanation;
