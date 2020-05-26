import React from 'react';
// import PropTypes from 'prop-types';
// import CreatableSelect from '@components/Form/Fields/CreatableSelect';
import Text from '@codaco/ui/lib/components/Fields/Text';
import EdgeTypeFields from '@components/sections/fields/EdgeTypeFields';
import { Section, Row } from '@components/EditorLayout';
import { getFieldId } from '@app/utils/issues';
import ValidatedField from '@components/Form/ValidatedField';
import Tip from '@components/Tip';

// TODO: EdgeTypeFields isn't quite right

const PromptFields = props => (
  <Section>
    <Row>
      <h3 id={getFieldId('text')}>Prompt Text</h3>
      <p>
        The prompt text instructs your participant about the task on this stage.
        Enter the text to use for your prompt below.
      </p>
      <Tip>
        <p>
          You can use markdown formatting in this prompt to create bold or underlined text.
        </p>
      </Tip>

      <ValidatedField
        name="text"
        component={Text}
        className="stage-editor-section-prompt__textarea"
        label=""
        placeholder="Enter text for the prompt here..."
        validation={{ required: true, maxLength: 220 }}
      />
    </Row>
    <Row>
      <EdgeTypeFields {...props} />
    </Row>
  </Section>
);

export { PromptFields };

export default PromptFields;
