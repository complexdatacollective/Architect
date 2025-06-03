import React from 'react';
import PropTypes from 'prop-types';
import { Field as RichText } from '@codaco/ui/lib/components/Fields/RichText';
import { Section, Row } from '@components/EditorLayout';
import ValidatedField from '@components/Form/ValidatedField';

const PromptText = ({ name }) => (
  <Section
    title="Prompt Text"
    summary={(
      <p>
        The prompt text instructs your participant about the task on this stage.
        Enter the text to use for your prompt below.
      </p>
    )}
  >
    <Row>
      <ValidatedField
        name={name}
        issueDescription="Prompt text"
        component={RichText}
        inline
        className="stage-editor-section-prompt__textarea"
        label=""
        placeholder="Enter text for the prompt here..."
        validation={{ required: true, maxLength: 220 }}
      />
    </Row>
  </Section>
);

PromptText.defaultProps = {
  name: 'text',
};

PromptText.propTypes = {
  name: PropTypes.string,
};

export default PromptText;
