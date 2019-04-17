import React from 'react';
import { FormSection } from 'redux-form';
import Guidance from '../Guidance';
import { ValidatedField } from '../Form';
import TextArea from '../../ui/components/Fields/TextArea';
import TextField from '../../ui/components/Fields/Text';
import Section from './Section';
import Row from './Row';
import IssueAnchor from '../IssueAnchor';

const Name = () => (
  <Guidance contentId="guidance.editor.introduction_panel">
    <Section>
      <FormSection name="introductionPanel">
        <h2>Introduction Panel</h2>
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
            name="title"
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
            name="text"
            label="Introduction text"
            component={TextArea}
            validation={{ required: true }}
          />
        </Row>
      </FormSection>
    </Section>
  </Guidance>
);

export default Name;
