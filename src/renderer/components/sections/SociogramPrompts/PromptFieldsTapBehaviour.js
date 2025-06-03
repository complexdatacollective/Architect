import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { change, formValueSelector } from 'redux-form';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { Section, Row } from '@components/EditorLayout';
import ValidatedField from '@components/Form/ValidatedField';
import Tip from '@components/Tip';
import EntitySelectField from '../fields/EntitySelectField/EntitySelectField';
import DetachedField from '../../DetachedField';
import VariablePicker from '../../Form/Fields/VariablePicker/VariablePicker';
import { getHighlightVariablesForSubject, getEdgeFilters } from './selectors';
import { actionCreators as codebookActions } from '../../../ducks/modules/protocol/codebook';
import getEdgeFilteringWarning from './utils';

// TODO: Move this somewhere else!
// This was created as part of removing the HOC pattern used throughout the app.
// It replaces withCreateVariableHandler. Other uses of this handler could be
// updated to use this function.
export const createVariableHandler = (dispatch, entity, type, form) => async (
  variableName,
  variableType,
  field,
) => {
  const withType = variableType ? { type: variableType } : {};

  const configuration = {
    name: variableName,
    ...withType,
  };

  const { variable } = await dispatch(codebookActions.createVariable(entity, type, configuration));

  // If we supplied a field, update it with the result of the variable creation
  if (field) {
    dispatch(change(form, field, variable));
  }

  return variable;
};

const TAP_BEHAVIOURS = {
  CREATE_EDGES: 'create edges',
  HIGHLIGHT_ATTRIBUTES: 'highlight attributes',
};

const TapBehaviour = ({
  form,
  type,
  entity,
}) => {
  const dispatch = useDispatch();
  const getFormValue = formValueSelector(form);
  const hasCreateEdgeBehaviour = useSelector((state) => !!getFormValue(state, 'edges.create'));
  const hasToggleAttributeBehaviour = useSelector((state) => !!getFormValue(state, 'highlight.allowHighlighting'));
  const highlightVariable = useSelector((state) => getFormValue(state, 'highlight.variable'));

  const highlightVariablesForSubject = useSelector(
    (state) => getHighlightVariablesForSubject(state, { type, entity }),
  );

  const handleCreateVariable = createVariableHandler(dispatch, entity, type, form);

  const initialState = () => {
    if (hasCreateEdgeBehaviour) {
      return TAP_BEHAVIOURS.CREATE_EDGES;
    }

    if (hasToggleAttributeBehaviour) {
      return TAP_BEHAVIOURS.HIGHLIGHT_ATTRIBUTES;
    }

    return null;
  };

  const [tapBehaviour, setTapBehaviour] = React.useState(initialState());

  const handleChangeTapBehaviour = (behaviour) => {
    setTapBehaviour(behaviour);
    if (behaviour === TAP_BEHAVIOURS.HIGHLIGHT_ATTRIBUTES) {
      // Reset edge creation
      dispatch(change(form, 'edges.create', null));
      dispatch(change(form, 'highlight.allowHighlighting', true));
    }

    if (behaviour === TAP_BEHAVIOURS.CREATE_EDGES) {
      // Reset attribute highlighting
      dispatch(change(form, 'highlight.allowHighlighting', false));
      dispatch(change(form, 'highlight.variable', null));
    }
  };

  const handleToggleChange = (value) => {
    if (value) {
      return true;
    }

    // Reset edge creation
    dispatch(change(form, 'edges.create', null));
    dispatch(change(form, 'highlight.allowHighlighting', false));
    dispatch(change(form, 'highlight.variable', null));

    return true;
  };

  const selectedValue = useSelector((state) => getFormValue(state, 'edges.create'));

  const edgeFilters = useSelector(getEdgeFilters);
  const showNetworkFilterWarning = getEdgeFilteringWarning(edgeFilters, [selectedValue]);

  return (
    <Section
      group
      title="Interaction Behavior"
      summary={(
        <p>
          Tapping a node on the sociogram can trigger one of two behaviors: assigning an
          attribute to the node, or creating an edge between two nodes.
        </p>
      )}
      toggleable
      startExpanded={
        tapBehaviour === TAP_BEHAVIOURS.CREATE_EDGES
        || !!hasCreateEdgeBehaviour
        || !!hasToggleAttributeBehaviour
      }
      handleToggleChange={handleToggleChange}
    >
      <Row>
        <DetachedField
          component={Fields.Boolean}
          onChange={handleChangeTapBehaviour}
          value={tapBehaviour}
          validation={{ required: true }}
          options={[
            {
              value: TAP_BEHAVIOURS.CREATE_EDGES,
              label: () => (
                <div>
                  <h4>Edge Creation</h4>
                  <p>
                    Clicking or tapping a node will allow the participant to create an edge.
                  </p>
                </div>
              ),
            },
            {
              value: TAP_BEHAVIOURS.HIGHLIGHT_ATTRIBUTES,
              label: () => (
                <div>
                  <h4>Attribute Toggling</h4>
                  <p>
                    Clicking or tapping a node will toggle a boolean variable to true or false.
                  </p>
                </div>
              ),
            },
          ]}
          noReset
        />
      </Row>
      <Row>
        {tapBehaviour === TAP_BEHAVIOURS.HIGHLIGHT_ATTRIBUTES && (
          <ValidatedField
            name="highlight.variable"
            component={VariablePicker}
            entity={entity}
            type={type}
            label="Boolean Attribute to Toggle"
            placeholder="Select or create a boolean variable"
            onCreateOption={(value) => handleCreateVariable(value, 'boolean', 'highlight.variable')}
            validation={{ required: true }}
            options={highlightVariablesForSubject}
            variable={highlightVariable}
          />
        )}
        { tapBehaviour === TAP_BEHAVIOURS.CREATE_EDGES && (
        <>
          {showNetworkFilterWarning && (
          <Tip type="warning">
            <p>
              Stage level network filtering is enabled, but the edge type you want to create
              on this prompt is not currently included in the filter. This means that these
              edges may not be displayed. Either remove the stage-level network filtering,
              or add these edge types to the filter to resolve this issue.
            </p>
          </Tip>
          )}

          <ValidatedField
            entityType="edge"
            name="edges.create"
            component={EntitySelectField}
            label="Create edges of the following type"
            validation={{ required: true }}
          />
        </>
        )}
      </Row>
    </Section>
  );
};

TapBehaviour.propTypes = {
  form: PropTypes.string.isRequired,
  entity: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default TapBehaviour;
