import React from 'react';
import { Field } from 'redux-form';
import { Section, Editor, Guidance } from '../../Guided';
import { SeamlessTextInput } from '../../../components/Form';
import { required, maxLength } from '../../../utils/validations';

const Title = () => (
  <Section className="stage-editor-section">
    <Editor className="stage-editor-section__edit">
      <h2>Title</h2>
      <Field
        name="label"
        component={SeamlessTextInput}
        placeholder="Enter your title here"
        className="stage-editor-section-title"
        validate={[required, maxLength(5)]}
      />
    </Editor>
    <Guidance className="stage-editor-section__guidance">
      What is the title for this interface?
    </Guidance>
  </Section>
);

export default Title;
