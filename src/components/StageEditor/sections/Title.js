/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Section, Editor, Guidance } from '../../Guided';
import { SeamlessTextInput } from '../../../components/Form';

const required = value => (value ? undefined : 'Required');
const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined;

const Title = ({ stage: { label }, onChange }) => (
  <Section className="stage-editor-section">
    <Editor className="stage-editor-section__edit">
      <h2>Title</h2>
      <Field
        name="label"
        component={SeamlessTextInput}
        // value={label}
        placeholder="Enter your title here"
        className="stage-editor-section-title"
        validate={[ required, maxLength(5) ]}
        // onChange={newLabel => onChange({ label: newLabel })}
      />
    </Editor>
    <Guidance className="stage-editor-section__guidance">
      What is the title for this interface?
    </Guidance>
  </Section>
);

Title.propTypes = {
  stage: PropTypes.object,
  onChange: PropTypes.func,
};

Title.defaultProps = {
  stage: {},
  onChange: () => {},
};

export default Title;
