import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { compose } from 'recompose';
import { getFieldId } from '../../../utils/issues';
import Guidance from '../../Guidance';
import { ValidatedField } from '../../Form';
import * as ArchitectFields from '../../Form/Fields';
import * as Fields from '../../../ui/components/Fields';
import { Row } from '../../OrderedList';
import Section from '../Section';
import withCreateVariableHandlers from '../../enhancers/withCreateVariableHandler';
import FieldsEdges from './PromptFieldsEdges';
import FieldsHighlight from './PromptFieldsHighlight';
import withOptions from './withOptions';
import withCanCreateEdgesState from './withCanCreateEdgesState';

const PromptFields = ({
  handleCreateVariable,
  variablesForNodeType,
  layoutVariablesForNodeType,
  ...rest
}) => (
  <div>
    <Guidance contentId="guidance.editor.sociogram_prompt.text">
      <Section>
        <h3 id={getFieldId('text')}>Prompt text</h3>
        <p>
          Enter the text to use for your prompt below. Remember that you can add emphasis to
          your prompt using markdown syntax.
        </p>
        <ValidatedField
          name="text"
          component={Fields.TextArea}
          label=""
          placeholder="Enter text for the prompt here"
          validation={{ required: true }}
        />
      </Section>
    </Guidance>
    <Guidance contentId="guidance.editor.sociogram_prompt.layout">
      <Section>
        <Row>
          <div id={getFieldId('layout.layoutVariable')} data-name="Layout Variable" />
          <h3>Layout</h3>
          <p>
            This section controls the position of nodes on this sociogram prompt. Decide
            if you want the participant to be able to drag nodes to position them, and
            select a layout variable to use for storing or retrieving position data.
          </p>
        </Row>
        <Row>
          <Field
            name="layout.allowPositioning"
            component={Fields.Checkbox}
            label="Allow dragging nodes to position them?"
          />
        </Row>
        <Row>
          <ValidatedField
            name="layout.layoutVariable"
            component={ArchitectFields.CreatableSelect}
            label="Layout variable"
            placeholder="&mdash; Select a layout variable &mdash;"
            validation={{ required: true }}
            options={layoutVariablesForNodeType}
            onCreateOption={value => handleCreateVariable(value, 'layout')}
          />
        </Row>
      </Section>
    </Guidance>
    <Guidance contentId="guidance.editor.sociogram_prompt.sortOrder">
      <Section>
        <p>
          If you wish to customise the order that nodes are displayed in the bin before they
          are positioned, create one or more sorting rules below.
        </p>
        <Field
          name="sortOrder"
          component={ArchitectFields.OrderBy}
          variables={variablesForNodeType}
          label="Node bin sorting rules:"
        />
      </Section>
    </Guidance>
    <FieldsHighlight {...rest} />
    <FieldsEdges {...rest} />
  </div>
);

PromptFields.propTypes = {
  handleCreateVariable: PropTypes.func.isRequired,
  variablesForNodeType: PropTypes.array.isRequired,
  layoutVariablesForNodeType: PropTypes.array.isRequired,
};

export { PromptFields };

export default compose(
  withOptions,
  withCanCreateEdgesState,
  withCreateVariableHandlers,
)(PromptFields);
