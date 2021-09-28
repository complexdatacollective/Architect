/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Field } from 'redux-form';
import Text from '@codaco/ui/lib/components/Fields/Text';
import CheckboxGroup from '@codaco/ui/lib/components/Fields/CheckboxGroup';
import VariableSelect from '@components/Form/Fields/VariableSelect';
import ValidatedField from '@components/Form/ValidatedField';
import { getFieldId } from '@app/utils/issues';
import { Section, Row } from '@components/EditorLayout';
import withPresetProps from './withPresetProps';

const PresetFields = ({
  edgesForSubject,
  entity,
  groupVariable,
  groupVariablesForSubject,
  handleCreateLayoutVariable,
  highlightVariablesForSubject,
  layoutVariable,
  layoutVariablesForSubject,
  type,
}) => (
  <>
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
          options={layoutVariablesForSubject}
          onCreateOption={handleCreateLayoutVariable}
          variable={layoutVariable}
        />
      </Row>
    </Section>
    <Section>
      <Row>
        <ValidatedField
          name="groupVariable"
          component={VariableSelect}
          allowPlaceholderSelect
          placeholder="None"
          label="Group variable"
          entity={entity}
          type={type}
          variable={groupVariable}
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
  </>
);

PresetFields.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  edgesForSubject: PropTypes.array,
  entity: PropTypes.string.isRequired,
  groupVariable: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  groupVariablesForSubject: PropTypes.array,
  handleCreateLayoutVariable: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  highlightVariablesForSubject: PropTypes.array,
  layoutVariable: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  layoutVariablesForSubject: PropTypes.array,
  type: PropTypes.string.isRequired,
};

PresetFields.defaultProps = {
  edgesForSubject: [],
  groupVariable: null,
  groupVariablesForSubject: [],
  highlightVariablesForSubject: [],
  layoutVariable: null,
  layoutVariablesForSubject: [],
};

export default compose(
  withPresetProps,
)(PresetFields);
