import React from 'react';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { Section } from '@components/EditorLayout';
import { ValidatedField } from '../Form';

const Title = () => (
  <Section
    title="Page Heading"
    summary={(
      <p>
        Use the page heading to show a large title element on your information stage.
      </p>
    )}
  >
    <ValidatedField
      name="title"
      issueDescription="Page Heading"
      component={Fields.Text}
      placeholder="Enter your title here..."
      className="stage-editor-section-title"
      validation={{ required: true }}
    />
  </Section>
);

export default Title;
