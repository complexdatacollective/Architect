import React from 'react';
import { Field as RichText } from '@codaco/ui/lib/components/Fields/RichText';
import { Section, Row } from '@components/EditorLayout';
import { getFieldId } from '@app/utils/issues';
import Tip from '@components/Tip';
import ValidatedField from '@components/Form/ValidatedField';
import EntitySelectField from '../fields/EntitySelectField/EntitySelectField';

const PromptFields = () => (
  <Section
    title="Dyad Census Prompts"
  >
    <Row>
      <div id={getFieldId('text')} data-title="Dyad Census Prompts" />
      <p>
        Dyad Census prompts explain to your participant which relationship they should
        evaluate (for example, &apos;friendship&apos;, &apos;material
        support&apos; or &apos;conflict&apos;). Enter prompt text below, and select an
        edge type that will be created when the participant answers &apos;yes&apos;.
      </p>
      <Tip type="info">
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
      </Tip>
      <ValidatedField
        name="text"
        component={RichText}
        inline
        className="stage-editor-section-prompt__textarea"
        label="Prompt Text"
        placeholder="Enter text for the prompt here..."
        validation={{ required: true, maxLength: 220 }}
      />
    </Row>
    <Row>
      <ValidatedField
        entityType="edge"
        name="createEdge"
        component={EntitySelectField}
        label="Create edges of the following type"
        validation={{ required: true }}
      />
    </Row>
  </Section>
);

export default PromptFields;
