import React from 'react';
import PropTypes from 'prop-types';
import { Section, Editor, Guidance } from '../../Guided';
import { SeamlessTextInput } from '../../../components/Form';

const Title = ({ stage: { label }, onChange, ...props }) => (
  <Section className="stage-editor-section" {...props}>
    <Editor className="stage-editor-section__edit">
      <h2>Title</h2>
      <SeamlessTextInput
        value={label}
        placeholder="Enter your title here"
        className="stage-editor-section-title"
        onChange={newLabel => onChange({ label: newLabel })}
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
