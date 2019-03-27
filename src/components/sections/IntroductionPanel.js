import React from 'react';
import { FormSection } from 'redux-form';
import Guidance from '../Guidance';
import { ValidatedField } from '../Form';
import Markdown from '../Form/Fields/Markdown';
import TextField from '../../ui/components/Fields/Text';
import IssueAnchor from '../IssueAnchor';

const Name = () => (
  <Guidance contentId="guidance.editor.introduction_panel">
    <div>
      <FormSection name="introductionPanel">
        <div className="stage-editor-section">
          <h2>Introduction Panel</h2>
          <p>
            This panel is shown prior to completion of the forms
            for the alters, and should serve as an introduction
            to the task.
          </p>
        </div>
        <div className="stage-editor-section">
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
          <IssueAnchor
            fieldName="introductionPanel.text"
            description="Text (Introduction panel)"
          />
          <ValidatedField
            name="text"
            label="Introduction text"
            component={Markdown}
            validation={{ required: true }}
          />
        </div>
      </FormSection>
    </div>
  </Guidance>
);

export default Name;
