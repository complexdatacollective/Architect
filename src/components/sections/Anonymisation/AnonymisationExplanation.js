import React from 'react';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { Section, Row } from '@components/EditorLayout';
import { ValidatedField } from '../../Form';
import IssueAnchor from '../../IssueAnchor';

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
      <IssueAnchor
        fieldName="explanationText.title"
        description="Title (Anonymisation explanation panel)"
      />
      <ValidatedField
        label="Title"
        name="explanationText.title"
        component={Fields.Text}
        placeholder="This interview uses enhanced privacy protection"
        validation={{ required: true }}
        maxLength="50"
      />
    </Row>
    <Row>
      <IssueAnchor
        fieldName="explanationText.body"
        description="Body (Anonymisation explanation panel)"
      />
      <ValidatedField
        label="Body"
        name="explanationText.body"
        component={Fields.RichText}
        placeholder="Enter your passphrase below, and click the 'continue' button."
        validation={{ required: true }}
      />

    </Row>

  </Section>
);

export default AnonymisationExplanation;
