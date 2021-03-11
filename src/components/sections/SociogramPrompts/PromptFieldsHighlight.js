import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { compose } from 'recompose';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { Section, Row } from '@components/EditorLayout';
import VariableSelect from '@components/Form/Fields/VariableSelect';
import ValidatedField from '@components/Form/ValidatedField';
import withCreateVariableHandlers from '@components/enhancers/withCreateVariableHandler';
import Tip from '@components/Tip';
import withHighlightOptions from './withHighlightOptions';
import withEdgeHighlightChangeHandler from './withEdgeHighlightChangeHandler';

const HighlightFields = ({
  allowHighlighting,
  canCreateEdge,
  entity,
  handleCreateVariable,
  handleEdgeHighlightChange,
  highlightVariablesForSubject,
  setCanCreateEdge,
  type,
}) => {
  const handleChangeAllowHighlighting = (value) => {
    handleEdgeHighlightChange();
    setCanCreateEdge(!value && canCreateEdge);
  };

  return (
    <Section group>
      <h3>Variable Toggling</h3>
      <p>
        The sociogram can be configured to allow the participant to toggle
        a node variable to true or false by tapping it.
      </p>
      <Tip>
        <p>
          You cannot use this setting at the same time
          as the &quot;Create edges&quot; option above. Enabling this setting will
          disable that option.
        </p>
      </Tip>
      <Field
        component={Fields.Toggle}
        name="highlight.allowHighlighting"
        onChange={handleChangeAllowHighlighting}
        label="Enable variable toggling by tapping a node"
        disabled={canCreateEdge}
        title={canCreateEdge ? 'Create edge must be disabled to allow highlighting' : ''}
      />
      { allowHighlighting
      && (
      <Row disabled={!allowHighlighting}>
        <ValidatedField
          name="highlight.variable"
          component={VariableSelect}
          entity={entity}
          type={type}
          label="Variable to be toggled"
          placeholder="Select or create a boolean variable"
          onCreateOption={(value) => handleCreateVariable(value, 'boolean', 'highlight.variable')}
          validation={{ required: true }}
          options={highlightVariablesForSubject}
        />
      </Row>
      )}
    </Section>
  );
};

HighlightFields.propTypes = {
  allowHighlighting: PropTypes.bool,
  canCreateEdge: PropTypes.bool.isRequired,
  entity: PropTypes.string.isRequired,
  handleCreateVariable: PropTypes.func.isRequired,
  handleEdgeHighlightChange: PropTypes.func.isRequired,
  highlightVariablesForSubject: PropTypes.array.isRequired,
  setCanCreateEdge: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

HighlightFields.defaultProps = {
  allowHighlighting: false,
};

export { HighlightFields };

export default compose(
  withHighlightOptions,
  withEdgeHighlightChangeHandler,
  withCreateVariableHandlers,
)(HighlightFields);
