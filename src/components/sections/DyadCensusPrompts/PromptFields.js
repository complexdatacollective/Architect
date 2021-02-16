import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import NativeSelect from '@components/Form/Fields/NativeSelect';
import Text from '@codaco/ui/lib/components/Fields/Text';
import { Section, Row } from '@components/EditorLayout';
import { getFieldId } from '@app/utils/issues';
import ValidatedField from '@components/Form/ValidatedField';
import Tip from '@components/Tip';
import withCreateEdgeHandlers from './withCreateEdgeHandler';
import withEdgesOptions from './withEdgesOptions';

const PromptFields = ({
  edgesForSubject,
  handleCreateEdge,
  handleChangeCreateEdge,
}) => (
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
      <ValidatedField
        name="createEdge"
        component={NativeSelect}
        options={edgesForSubject}
        onCreateOption={(option) => {
          handleChangeCreateEdge(handleCreateEdge(option));
        }}
        onChange={handleChangeCreateEdge}
        placeholder="Select or create an edge type"
        createLabelText="✨ Create new edge type ✨"
        createInputLabel="New edge type name"
        createInputPlaceholder="Enter an edge type..."
        label="Query edges of the following type"
        validation={{ required: true, allowedNMToken: 'edge type name' }}
      />
    </Row>
  </Section>
);

PromptFields.propTypes = {
  edgesForSubject: PropTypes.array.isRequired,
  handleCreateEdge: PropTypes.func.isRequired,
  handleChangeCreateEdge: PropTypes.func.isRequired,
};

export { PromptFields };

export default compose(
  withCreateEdgeHandlers,
  withEdgesOptions,
)(PromptFields);
