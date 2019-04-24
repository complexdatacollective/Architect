import React from 'react';
import { ValidatedField } from '../Form';
import * as Fields from '../../ui/components/Fields';
import { getFieldId } from '../../utils/issues';

const Title = () => (
  <Section contentId="guidance.editor.title">
    <div id={getFieldId('title')} data-name="Title text" />
    <h2 id="title">Page Heading</h2>
    <p>
      Use the page heading to show a large title element on your information stage.
    </p>
    <ValidatedField
      name="title"
      component={Fields.Text}
      placeholder="Enter your title here"
      className="stage-editor-section-title"
      validation={{ required: true }}
    />
  </Section>
);

export default Title;
