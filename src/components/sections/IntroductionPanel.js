import React from 'react';
import { Field as RichText } from '@codaco/ui/lib/components/Fields/RichText';
import TextField from '@codaco/ui/lib/components/Fields/Text';
import { Section, Row } from '@components/EditorLayout';
import { ValidatedField } from '../Form';
import IssueAnchor from '../IssueAnchor';

const Name = () => (
  <Section title="Introduction Panel">
    <p>
      This panel is shown prior to completion of the forms,
      and should serve as an introduction to the task.
    </p>
    <Row>
      <IssueAnchor
        fieldName="introductionPanel.title"
        description="Title (Introduction panel)"
      />
      <ValidatedField
        name="introductionPanel.title"
        label="Title"
        component={TextField}
        maxLength="50"
        validation={{ required: true }}
      />
    </Row>
    <Row>
      <IssueAnchor
        fieldName="introductionPanel.text"
        description="Text (Introduction panel)"
      />
      <ValidatedField
        name="introductionPanel.text"
        label="Introduction text"
        component={RichText}
        validation={{ required: true }}
      />
    </Row>
  </Section>
);

export default Name;
