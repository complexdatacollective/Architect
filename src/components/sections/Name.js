import React from 'react';
import * as Fields from '@codaco/ui/lib/components/Fields';
// import { ValidatedField } from '../../components/Form';
import { get } from 'lodash';
import Field from '@components/Form/Field';
import { getFieldId } from '../../utils/issues';
import Section from './Section';

const Name = ({ onChange, stage }) => (
  <Section contentId="guidance.editor.name">
    <div id={getFieldId('label')} data-name="Stage name" />
    <h2>Stage Name</h2>
    <p>
      Enter a name for your stage here. This name will appear in the timeline view of your
      protocol in both Architect and Network Canvas.
    </p>
    {console.log('render')};
    <Field
      name="label"
      component={Fields.Text}
      placeholder="Enter your stage name here"
      className="stage-editor-section-title"
      maxLength="50"
      value={get(stage, 'label', '')}
      onChange={(e, oldValue, value) => onChange('label', value)}
      validation={{ required: true, maxLength: 10 }}
    />
  </Section>
);

export default Name;
