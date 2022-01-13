/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Field } from 'redux-form';
import Text from '@codaco/ui/lib/components/Fields/Text';
import CheckboxGroup from '@codaco/ui/lib/components/Fields/CheckboxGroup';
import ValidatedField from '@components/Form/ValidatedField';
import { getFieldId } from '@app/utils/issues';
import { Section, Row } from '@components/EditorLayout';
import withPresetProps from './withPresetProps';
import VariablePicker from '../../Form/Fields/VariablePicker/VariablePicker';

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
    <Section title="Preset Label">
      <Row>
        <div id={getFieldId('text')}>Preset label</div>
        <ValidatedField
          name="label"
          component={Text}
          label=""
          placeholder="Enter a label for the preset..."
          validation={{ required: true }}
        />
      </Row>
    </Section>
    <Section title="Layout Variable">
      <Row>
        <ValidatedField
          name="layoutVariable"
          component={VariablePicker}
          entity={entity}
          type={type}
          validation={{ required: true }}
          options={layoutVariablesForSubject}
          onCreateOption={handleCreateLayoutVariable}
          variable={layoutVariable}
        />
      </Row>
    </Section>
    <Section
      title="Group Variable"
      summary={(
        <p>
          Select a categorical variable to draw convex hulls
          around nodes based on their value(s).
        </p>
      )}
    >
      <Row>
        <Field
          name="groupVariable"
          component={VariablePicker}
          allowPlaceholderSelect
          placeholder="None"
          entity={entity}
          type={type}
          variable={groupVariable}
          options={groupVariablesForSubject}
        />
      </Row>
    </Section>
    <Section title="Edge Types to Display">
      <Row>
        <Field
          name="edges.display"
          component={CheckboxGroup}
          label="Select one or more edge types"
          placeholder="&mdash; Toggle an edge to display &mdash;"
          options={edgesForSubject}
        />
      </Row>
    </Section>
    <Section
      title="Highlight Nodes"
      summary={(
        <p>
          Select one or more boolean variables below. Nodes whose
          value is &quot;true&quot; for this variable will be highlighted.
        </p>
      )}
    >
      <Row>
        <Field
          name="highlight"
          component={CheckboxGroup}
          label="Select one or more boolean variables"
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
