/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Field } from 'redux-form';
import Text from '@codaco/ui/lib/components/Fields/Text';
import CheckboxGroup from '@codaco/ui/lib/components/Fields/CheckboxGroup';
import Select from '@components/Form/Fields/Select';
import CreatableSelect from '@components/Form/Fields/CreatableSelect';
import ValidatedField from '@components/Form/ValidatedField';
import { getFieldId } from '@app/utils/issues';
import withNewVariableWindowHandlers, {
  propTypes as newVariableWindowPropTypes,
} from '@components/enhancers/withNewVariableWindowHandlers';
import { normalizeKeyDown } from '@components/enhancers/withCreateVariableHandler';
import { Section, Row } from '@components/EditorLayout';
import withPresetProps from './withPresetProps';

const PresetFields = ({
  layoutVariblesForSubject,
  groupVariablesForSubject,
  edgesForSubject,
  highlightVariablesForSubject,
  handleCreateLayoutVariable,
  handleDeleteVariable,
}) => (
  <Section>
    <Row>
      <h3 id={getFieldId('text')}>Preset label</h3>
      <ValidatedField
        name="label"
        component={Text}
        label=""
        placeholder="Enter a label for the preset here"
        validation={{ required: true }}
      />
    </Row>
    <Row>
      <ValidatedField
        name="layoutVariable"
        component={CreatableSelect}
        label="Layout variable"
        placeholder="&mdash; Select a layout variable &mdash;"
        validation={{ required: true }}
        options={layoutVariblesForSubject}
        onCreateOption={handleCreateLayoutVariable}
        onKeyDown={normalizeKeyDown}
        onDeleteOption={handleDeleteVariable}
        formatCreateLabel={inputValue => (
          <span>Click here to create a new layout variable named &quot;{inputValue}&quot;.</span>
        )}
      />
    </Row>
    <Row>
      <ValidatedField
        name="groupVariable"
        component={Select}
        label="Group variable"
        options={groupVariablesForSubject}
      />
    </Row>
    <Row>
      <Field
        name="edges.display"
        component={CheckboxGroup}
        label="Display the following edges:"
        placeholder="&mdash; Toggle an edge to display &mdash;"
        options={edgesForSubject}
      />
    </Row>
    <Row>
      <Field
        name="highlight"
        component={CheckboxGroup}
        label="Highlight nodes with the following attribute:"
        placeholder="&mdash; Toggle a variable to highlight &mdash;"
        options={highlightVariablesForSubject}
      />
    </Row>
  </Section>
);

PresetFields.propTypes = {
  layoutVariblesForSubject: PropTypes.array,
  groupVariablesForSubject: PropTypes.array,
  edgesForSubject: PropTypes.array,
  highlightVariablesForSubject: PropTypes.array,
  handleCreateLayoutVariable: PropTypes.func.isRequired,
  handleDeleteVariable: PropTypes.func.isRequired,
  ...newVariableWindowPropTypes,
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
