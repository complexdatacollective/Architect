import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { compose } from 'recompose';
import { getFieldId } from '../../../utils/issues';
import { ValidatedField } from '../../Form';
import * as ArchitectFields from '../../Form/Fields';
import * as Fields from '../../../ui/components/Fields';
import Row from '../Row';
import Section from '../Section';
import withCreateVariableHandlers from '../../enhancers/withCreateVariableHandler';
import withLayoutOptions from './withLayoutOptions';
import withCanCreateEdgesState from './withCanCreateEdgesState';

const PromptFields = ({
  handleCreateVariable,
  variablesForSubject,
  layoutVariablesForSubject,
  allowPositioning,
}) => (
  <Section contentId="guidance.editor.sociogram_prompt.layout" group>
    <Row>
      <div id={getFieldId('layout.layoutVariable')} data-name="Layout Variable" />
      <h3>Layout</h3>
      <p>
        This section controls the position of nodes on this sociogram prompt.
      </p>
    </Row>
    <Row>
      <h4>Layout variable</h4>
      <p>Which variable should be used to store or retrieve the X/Y coordinates of nodes?</p>
      <ValidatedField
        name="layout.layoutVariable"
        component={ArchitectFields.CreatableSelect}
        placeholder="&mdash; Select a new layout variable, or type to create a new one &mdash;"
        validation={{ required: true }}
        options={layoutVariablesForSubject}
        onCreateOption={value => handleCreateVariable(value, 'layout')}
      />
    </Row>
    <Row>
      <h4>Can nodes be positioned?</h4>
      <p>Allow nodes to be positioned by dragging.</p>
      <Field
        name="layout.allowPositioning"
        component={Fields.Toggle}
        label="Allow positioning?"
      />
    </Row>
    { allowPositioning &&
      <Row contentId="guidance.editor.sociogram_prompt.sortOrder">
        <h4>Sort unplaced nodes</h4>
        <p>
          Would you like to sort unplaced nodes in the node bin?
        </p>
        <Field
          name="sortOrder"
          component={ArchitectFields.OrderBy}
          variables={variablesForSubject}
        />
      </Row>
    }
  </Section>
);

PromptFields.propTypes = {
  handleCreateVariable: PropTypes.func.isRequired,
  variablesForSubject: PropTypes.object.isRequired,
  layoutVariablesForSubject: PropTypes.array.isRequired,
  allowPositioning: PropTypes.bool,
};

PromptFields.defaultProps = {
  allowPositioning: false,
};

export { PromptFields };

export default compose(
  withLayoutOptions,
  withCanCreateEdgesState,
  withCreateVariableHandlers,
)(PromptFields);
