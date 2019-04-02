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
import withLayoutOptions from './withLayoutOptions';
import withCanCreateEdgesState from './withCanCreateEdgesState';

const PromptFields = ({
  handleCreateVariable,
  variablesForNodeType,
  layoutVariablesForNodeType,
  allowPositioning,
}) => (
  <Guidance contentId="guidance.editor.sociogram_prompt.layout">
    <Section group>
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
        <ValidatedField
          name="layout.layoutVariable"
          component={ArchitectFields.CreatableSelect}
          label="Which layout do you want to use?"
          placeholder="&mdash; Select a layout variable &mdash;"
          validation={{ required: true }}
          options={layoutVariablesForNodeType}
          onCreateOption={value => handleCreateVariable(value, 'layout')}
        />
      </Row>
      <Row>
        <Field
          name="layout.allowPositioning"
          component={Fields.Toggle}
          label="Allow nodes to be positioned? (by dragging)"
        />
      </Row>
      { allowPositioning &&
        <Guidance contentId="guidance.editor.sociogram_prompt.sortOrder">
          <Row>
            <h4>Unplaced nodes</h4>
            <p>
              Would you like to sort unplaced nodes in the node bin?
            </p>
            <Field
              name="sortOrder"
              component={ArchitectFields.OrderBy}
              variables={variablesForNodeType}
            />
          </Row>
        </Guidance>
      }
    </Section>
  </Guidance>
);

PromptFields.propTypes = {
  handleCreateVariable: PropTypes.func.isRequired,
  variablesForNodeType: PropTypes.object.isRequired,
  layoutVariablesForNodeType: PropTypes.array.isRequired,
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
