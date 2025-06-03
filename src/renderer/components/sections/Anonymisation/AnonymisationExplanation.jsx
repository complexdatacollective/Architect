import React from 'react';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { Section, Row } from '@components/EditorLayout';
import { ValidatedField } from '../../Form';

const AnonymisationExplanation = () => (
  <Section
    title="Task Explanation"
    summary={(
      <p>
        Use this section to explain the anonymisation process to your participants.
      </p>
    )}
  >
    <Row>
      <ValidatedField
        label="Title"
        issueDescription="Title (Anonymisation explanation panel)"
        name="explanationText.title"
        component={Fields.Text}
        placeholder="This interview uses enhanced privacy protection"
        validation={{ required: true }}
        maxLength="50"
      />
    </Row>
    <Row>
      <ValidatedField
        label="Body"
        issueDescription="Body (Anonymisation explanation panel)"
        name="explanationText.body"
        component={Fields.RichText}
        placeholder="Enter your passphrase below, and click the 'continue' button."
        validation={{ required: true }}
      />
    </Row>
  </Section>
);

export default AnonymisationExplanation;
