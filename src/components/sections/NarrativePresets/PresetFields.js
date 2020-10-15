/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Field } from 'redux-form';
import Text from '@codaco/ui/lib/components/Fields/Text';
import CheckboxGroup from '@codaco/ui/lib/components/Fields/CheckboxGroup';
import NativeSelect from '@components/Form/Fields/NativeSelect';
import VariableSelect from '@components/Form/Fields/VariableSelect';
import ValidatedField from '@components/Form/ValidatedField';
import { getFieldId } from '@app/utils/issues';
import withNewVariableWindowHandlers from '@components/enhancers/withNewVariableWindowHandlers';
import { Section, Row } from '@components/EditorLayout';
import withPresetProps from './withPresetProps';

const PresetFields = ({
  layoutVariblesForSubject,
  groupVariablesForSubject,
  edgesForSubject,
  highlightVariablesForSubject,
  handleCreateLayoutVariable,
  entity,
  type,
}) => (
  <React.Fragment>
    <Section>
      <Row>
        <h3 id={getFieldId('text')}>Preset label</h3>
        <ValidatedField
          name="label"
          component={Text}
          label=""
          placeholder="Enter a label for the preset..."
          validation={{ required: true }}
        />
      </Row>
    </Section>
    <Section>
      <Row>
        <ValidatedField
          name="layoutVariable"
          component={VariableSelect}
          entity={entity}
          type={type}
          label="Layout variable"
          validation={{ required: true }}
          options={layoutVariblesForSubject}
          onCreateOption={handleCreateLayoutVariable}
        />
      </Row>
    </Section>
    <Section>
      <Row>
        <ValidatedField
          name="groupVariable"
          component={NativeSelect}
          allowPlaceholderSelect
          placeholder="None"
          label="Group variable"
          options={groupVariablesForSubject}
        />
      </Row>
    </Section>
    <Section>
      <Row>
        <Field
          name="edges.display"
          component={CheckboxGroup}
          label="Edge types to display"
          placeholder="&mdash; Toggle an edge to display &mdash;"
          options={edgesForSubject}
        />
      </Row>
    </Section>
    <Section>
      <Row>
        <Field
          name="highlight"
          component={CheckboxGroup}
          label="Highlight nodes with the following attributes"
          placeholder="&mdash; Toggle a variable to highlight &mdash;"
          options={highlightVariablesForSubject}
        />
      </Row>
    </Section>
  </React.Fragment>
);

PresetFields.propTypes = {
  layoutVariblesForSubject: PropTypes.array,
  groupVariablesForSubject: PropTypes.array,
  edgesForSubject: PropTypes.array,
  highlightVariablesForSubject: PropTypes.array,
  handleCreateLayoutVariable: PropTypes.func.isRequired,
  entity: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

PresetFields.defaultProps = {
  layoutVariblesForSubject: [],
  groupVariablesForSubject: [],
  edgesForSubject: [],
  highlightVariablesForSubject: [],
};

export { PresetFields };

export default compose(
  withNewVariableWindowHandlers,
  withPresetProps,
)(PresetFields);
