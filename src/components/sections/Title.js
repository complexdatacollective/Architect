import React from 'react';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { Section } from '@components/EditorLayout';
import { ValidatedField } from '../Form';
import { getFieldId } from '../../utils/issues';

const Title = () => (
  <Section
    title="Page Heading"
    summary={(
      <p>
        Use the page heading to show a large title element on your information stage.
      </p>
    )}
  >
    <div id={getFieldId('title')} data-name="Page Heading" />
    <ValidatedField
      name="title"
      component={Fields.Text}
      placeholder="Enter your title here..."
      className="stage-editor-section-title"
      validation={{ required: true }}
    />
  </Section>
);

export default Title;
