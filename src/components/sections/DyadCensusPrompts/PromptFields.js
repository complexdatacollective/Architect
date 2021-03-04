import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import NativeSelect from '@components/Form/Fields/NativeSelect';
import { Field as RichTextField, MODES } from '@components/RichText';
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
      <h3 id={getFieldId('text')}>Dyad Census Prompts</h3>
      <p>
        Dyad Census prompts explain to your participant which relationship they should
        evaluate (for example, &apos;friendship&apos;, &apos;material
        support&apos; or &apos;conflict&apos;). Enter prompt text below, and select an
        edge type that will be created when the participant answers &apos;yes&apos;.
      </p>
      <p>
        Remember to write your prompt text to take into account that the participant will be
        looking at pairs of prompts in sequence. Use phrases such
        as &apos;
        <strong>these people</strong>
        &apos;,
        or &apos;
        <strong>the two people shown</strong>
        &apos; to
        indicate that the participant should focus on the visible pair.
      </p>
      <p>
        You should also phrase your prompt so that it can be answered with
        either a &apos;yes&apos; or a &apos;no&apos; by the participant, since these
        are the user-interface options that are shown.
      </p>
      <Tip>
        <p>
          You can use markdown formatting in this prompt to create bold or underlined text.
        </p>
      </Tip>

      <ValidatedField
        name="text"
        component={RichTextField}
        mode={MODES.single}
        className="stage-editor-section-prompt__textarea"
        label="Prompt Text"
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
        label="Create edges of the following type"
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
