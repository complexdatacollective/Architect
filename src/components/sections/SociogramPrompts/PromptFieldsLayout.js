import React from 'react';
import PropTypes from 'prop-types';
import { change, formValueSelector } from 'redux-form';
import { compose } from 'recompose';
import { getFieldId } from '@app/utils/issues';
import { ValidatedField } from '@components/Form';
import MultiSelect from '@components/Form/MultiSelect';
import withCreateVariableHandlers from '@components/enhancers/withCreateVariableHandler';
import { Section, Row } from '@components/EditorLayout';
import { useDispatch, useSelector } from 'react-redux';
import withLayoutOptions from './withLayoutOptions';
import withCanCreateEdgesState from './withCanCreateEdgesState';
import VariablePicker from '../../Form/Fields/VariablePicker/VariablePicker';
import { getSortOrderOptionGetter } from '../CategoricalBinPrompts/optionGetters';
import Tip from '../../Tip';

const PromptFields = ({
  form,
  allowPositioning,
  entity,
  handleCreateVariable,
  layoutVariablesForSubject,
  layoutVariable,
  type,
  variableOptions,
}) => {
  const dispatch = useDispatch();
  const getFormValue = formValueSelector(form);
  const hasSortOrder = useSelector((state) => getFormValue(state, 'sortOrder'));

  const handleToggleSortOrder = (nextState) => {
    if (nextState === false) {
      dispatch(change(form, 'sortOrder', null));
    }

    return true;
  };

  return (
    <Section
      title="Layout"
      summary={(
        <p>
          This variable stores the position of nodes on the sociogram.
        </p>
      )}
      group
    >
      <Row>
        <div id={getFieldId('layout.layoutVariable')} data-name="Layout Variable" />
        <Tip type="info">
          <p>
            If you use the same layout variable across all prompts, the position of nodes will
            be automatically set as the participant moves between tasks.
          </p>
        </Tip>
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
              Nodes are stacked in a bucket until your participant drags them
              into position. You can control the order of this stack, which will determine the order
              that your participant is able to position the nodes.
            </p>
          )}
          startExpanded={!!hasSortOrder}
          handleToggleChange={handleToggleSortOrder}
        >
          <Row>
            <MultiSelect
              name="sortOrder"
              properties={[
                { fieldName: 'property' },
                { fieldName: 'direction' },
              ]}
              maxItems={5}
              options={getSortOrderOptionGetter(variableOptions)}
            />
          </Row>
        </Section>
        )}
    </Section>
  );
};

const layoutVariablesForSubjectShape = PropTypes.shape({
  isUsed: PropTypes.bool,
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
});

PromptFields.propTypes = {
  form: PropTypes.string.isRequired,
  allowPositioning: PropTypes.bool,
  entity: PropTypes.string.isRequired,
  handleCreateVariable: PropTypes.func.isRequired,
  layoutVariable: PropTypes.string,
  layoutVariablesForSubject: PropTypes.arrayOf(layoutVariablesForSubjectShape).isRequired,
  type: PropTypes.string.isRequired,
  variableOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]),
  })).isRequired,
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
