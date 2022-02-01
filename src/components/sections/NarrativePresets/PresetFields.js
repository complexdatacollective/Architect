/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { useDispatch, useSelector } from 'react-redux';
import { change, Field, formValueSelector } from 'redux-form';
import Text from '@codaco/ui/lib/components/Fields/Text';
import CheckboxGroup from '@codaco/ui/lib/components/Fields/CheckboxGroup';
import ValidatedField from '@components/Form/ValidatedField';
import Section from '../../EditorLayout/Section';
import Row from '../../EditorLayout/Row';
import withPresetProps from './withPresetProps';
import VariablePicker from '../../Form/Fields/VariablePicker/VariablePicker';

const PresetFields = ({
  form,
  edgesForSubject,
  entity,
  groupVariable,
  groupVariablesForSubject,
  handleCreateLayoutVariable,
  highlightVariablesForSubject,
  layoutVariable,
  layoutVariablesForSubject,
  type,
}) => {
  const getFormValue = formValueSelector(form);

  const dispatch = useDispatch();
  const hasGroupVariable = !!groupVariable;
  const displayEdges = useSelector((state) => getFormValue(state, 'edges.display'));
  const hasDisplayEdges = displayEdges && displayEdges.length > 0;
  const highlightVariables = useSelector((state) => getFormValue(state, 'highlight'));
  const hasHighlightVariables = highlightVariables && highlightVariables.length > 0;

  const handleToggleHighlightVariables = (open) => {
    if (open) {
      return true;
    }

    dispatch(change(form, 'highlight', null));
    return true;
  };

  const handleToggleDisplayEdges = (open) => {
    if (open) {
      return true;
    }

    dispatch(change(form, 'edges', null));
    return true;
  };

  const handleToggleGroupVariable = (open) => {
    if (open) {
      return true;
    }

    dispatch(change(form, 'groupVariable', null));
    return true;
  };

  return (
    <>
      <Section
        title="Preset Label"
        summary={(
          <p>
            The preset label will used to quickly identify the preset from within
            the narrative interface. It will be visible to the participant.
          </p>
        )}
      >
        <Row>
          <ValidatedField
            name="label"
            label="Preset label"
            component={Text}
            placeholder="Enter a label for the preset..."
            validation={{ required: true }}
          />
        </Row>
      </Section>
      <Section
        title="Layout Variable"
        summary={(
          <p>
            Select a variable to use to position the nodes for this preset.
          </p>
        )}
      >
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
            Select a categorical variable which will be used to draw convex hulls
            around nodes.
          </p>
        )}
        toggleable
        disabled={!groupVariablesForSubject.length > 0}
        startExpanded={hasGroupVariable && groupVariablesForSubject.length > 0}
        handleToggleChange={handleToggleGroupVariable}
      >
        <Row>
          <p>
            This feature will draw a semi-transparent convex hull for each categorical
            value of the variable you select. If a node&apos;s attributes include this
            categorical value, the hull will be expanded to include the node. If a node has
            multiple values for this categorical variable, it will appear in multiple
            overlapping hulls.
          </p>
          <Field
            name="groupVariable"
            label="Select a categorical variable for grouping"
            component={VariablePicker}
            entity={entity}
            type={type}
            variable={groupVariable}
            options={groupVariablesForSubject}
            disallowCreation
          />
        </Row>
      </Section>
      <Section
        title="Display Edges"
        toggleable
        startExpanded={hasDisplayEdges && edgesForSubject.length > 0}
        handleToggleChange={handleToggleDisplayEdges}
        disabled={!edgesForSubject.length > 0}
        summary={(
          <p>
            Select one or more edge types to display on this narrative preset.
          </p>
        )}
      >
        <Row>
          <Field
            name="edges.display"
            component={CheckboxGroup}
            label="Edge types"
            placeholder="&mdash; Toggle an edge to display &mdash;"
            options={edgesForSubject}
          />
        </Row>
      </Section>
      <Section
        title="Highlight Node Attributes"
        summary={(
          <p>
            Select one or more boolean variables below. Nodes whose
            value is &quot;true&quot; for this variable will be highlighted when this preset
            is active.
          </p>
        )}
        toggleable
        startExpanded={hasHighlightVariables && highlightVariablesForSubject.length > 0}
        disabled={!highlightVariablesForSubject.length > 0}
        handleToggleChange={handleToggleHighlightVariables}
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
};

PresetFields.propTypes = {
  form: PropTypes.string.isRequired,
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
