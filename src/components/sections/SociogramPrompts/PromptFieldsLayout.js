import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { compose } from 'recompose';
import { getFieldId } from '@app/utils/issues';
import { ValidatedField } from '@components/Form';
import OrderBy from '@components/Form/Fields/OrderBy';
import withCreateVariableHandlers from '@components/enhancers/withCreateVariableHandler';
import { Section, Row } from '@components/EditorLayout';
import withLayoutOptions from './withLayoutOptions';
import withCanCreateEdgesState from './withCanCreateEdgesState';
import VariablePicker from '../../Form/Fields/VariablePicker/VariablePicker';

const PromptFields = ({
  allowPositioning,
  entity,
  handleCreateVariable,
  layoutVariablesForSubject,
  layoutVariable,
  type,
  variablesForSubject,
}) => (
  <Section
    title="Layout"
    summary={(
      <p>
        This section controls the position of nodes on this sociogram prompt.
      </p>
    )}
    group
  >
    <Row>
      <div id={getFieldId('layout.layoutVariable')} data-name="Layout Variable" />
      <ValidatedField
        name="layout.layoutVariable"
        label="Create or select a variable to store node coordinates"
        type={type}
        entity={entity}
        component={VariablePicker}
        validation={{ required: true }}
        options={layoutVariablesForSubject}
        onCreateOption={(value) => handleCreateVariable(value, 'layout', 'layout.layoutVariable')}
        variable={layoutVariable}
      />
    </Row>
    { allowPositioning
      && (
      <Section
        toggleable
        title="Sort Unplaced Nodes"
        summary={(
          <p>
            Nodes without any coordinates are stacked in a bucket until your participant drags them
            into position. You can control the order of this stack, which will determine the order
            that your participant is able to position the nodes.
          </p>
        )}
      >
        <Row>
          <Field
            name="sortOrder"
            component={OrderBy}
            variables={variablesForSubject}
          />
        </Row>
      </Section>
      )}
  </Section>
);

const layoutVariablesForSubjectShape = PropTypes.shape({
  isUsed: PropTypes.bool,
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
});

PromptFields.propTypes = {
  allowPositioning: PropTypes.bool,
  entity: PropTypes.string.isRequired,
  handleCreateVariable: PropTypes.func.isRequired,
  layoutVariable: PropTypes.string,
  layoutVariablesForSubject: PropTypes.arrayOf(layoutVariablesForSubjectShape).isRequired,
  type: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  variablesForSubject: PropTypes.object.isRequired,
};

PromptFields.defaultProps = {
  allowPositioning: true,
  layoutVariable: null,
};

export { PromptFields };

export default compose(
  withLayoutOptions,
  withCanCreateEdgesState,
  withCreateVariableHandlers,
)(PromptFields);
