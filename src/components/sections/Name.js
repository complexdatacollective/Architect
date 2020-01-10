import React from 'react';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { ValidatedField } from '../../components/Form';
import { getFieldId } from '../../utils/issues';
import Section from './Section';

const Name = () => (
  <Section contentId="guidance.editor.name">
    <div id={getFieldId('label')} data-name="Stage name" />
    <h2>Stage Name</h2>
    <p>
      Enter a name for your stage here. This name will appear in the timeline view of your
      protocol in both Architect and Network Canvas.
    </p>
    <ValidatedField
      name="label"
      component={Fields.Text}
      placeholder="Enter your stage name here"
      className="stage-editor-section-title"
      maxLength="50"
      validation={{ required: true }}
    />
  </Section>
);

export default Name;
