import React from 'react';
import propTypes from './propTypes';
import { Section, Editor, Guidance } from '../../Guided';
import { ValidatedField } from '../../../components/Form';
import SeamlessText from '../../../components/Form/Fields/SeamlessText';

const Title = ({ form, ...props }) => (
  <Section className="stage-editor-section" {...props}>
    <Editor className="stage-editor-section__edit">
      <h2>Title</h2>
      <ValidatedField
        name="label"
        component={SeamlessText}
        placeholder="Enter your title here"
        className="stage-editor-section-title"
        validation={{ required: true }}
      />
    </Editor>
    <Guidance className="stage-editor-section__guidance">
      <p>
        {'A good stage title should be descriptive, but not too long. It should help you to remember the purpose of this stage later.'}
      </p>
      <p>
        {'It might help to use a standard format for the names of your interview stages, such as '}<code>[TYPE]: [VARIABLE]</code>
      </p>
      <p>
        {'This text is displayed in the menu within Network Canvas, and on the timeline in Architect.'}
      </p>
    </Guidance>
  </Section>
);

Title.propTypes = {
  ...propTypes,
};

export default Title;
