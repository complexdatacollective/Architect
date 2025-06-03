import React, { useCallback, useMemo } from 'react';
import { change, Field, formValueSelector } from 'redux-form';
import { useDispatch, useSelector } from 'react-redux';
import { Section } from '@components/EditorLayout';
import { actionCreators as dialogActions } from '@modules/dialogs';
import {
  Filter as FilterQuery, withFieldConnector, withStoreConnector, ruleValidator,
} from '../Query';
import Tip from '../Tip';
import getEdgeFilteringWarning from './SociogramPrompts/utils';
import IssueAnchor from '../IssueAnchor';

const FilterField = withFieldConnector(withStoreConnector(FilterQuery));

export const handleFilterDeactivate = async (openDialog) => {
  const result = await openDialog({
    type: 'Warning',
    title: 'This will clear your filter',
    message: 'This will clear your filter, and delete any rules you have created. Do you want to continue?',
    confirmLabel: 'Clear filter',
  });

  return result;
};

const Filter = () => {
  const getFormValue = formValueSelector('edit-stage');
  const dispatch = useDispatch();
  const currentValue = useSelector((state) => getFormValue(state, 'filter'));
  const openDialog = useCallback(
    (dialog) => dispatch(dialogActions.openDialog(dialog)),
    [dispatch],
  );

  // get edge creation and display values for edges across all prompts
  const prompts = useSelector((state) => getFormValue(state, 'prompts'));

  const { edgeCreationValues, edgeDisplayValues } = useMemo(() => {
    if (!prompts) return { edgeCreationValues: [], edgeDisplayValues: [] };
    const creationValues = [];
    const displayValues = [];
    prompts.forEach((prompt) => {
      if (prompt?.edges?.create) creationValues.push(prompt.edges.create);
      if (prompt?.edges?.display) displayValues.push(...prompt.edges.display);
    });
    return { edgeCreationValues: creationValues, edgeDisplayValues: displayValues };
  }, [prompts]);
  const shouldShowWarning = useMemo(() => {
    if (edgeCreationValues.length > 0 || edgeDisplayValues.length > 0) {
      return getEdgeFilteringWarning(
        (currentValue && currentValue.rules) || [],
        [...edgeCreationValues, ...edgeDisplayValues],
      );
    }
    return false;
  }, [currentValue, edgeCreationValues, edgeDisplayValues]);

  const handleToggleChange = useCallback(
    async (newState) => {
      if (!currentValue || newState === true) {
        return true;
      }

      const confirm = await handleFilterDeactivate(openDialog);

      if (confirm) {
        dispatch(change('edit-stage', 'filter', null));
        return true;
      }

      return false;
    },
    [dispatch, openDialog, currentValue],
  );

  return (
    <Section
      title="Filter"
      toggleable
      summary={(
        <p>
          You can optionally filter which nodes or edges are shown on this stage, by creating
          one or more rules using the options below.
        </p>
      )}
      startExpanded={!!currentValue}
      handleToggleChange={handleToggleChange}
    >
      {shouldShowWarning && (
      <Tip type="warning">
        <p>
          This stage has edge creation or display values that will not be shown
          based on the current filter rules.
        </p>
      </Tip>
      )}
      <IssueAnchor fieldName="filter" description="Filter text">
        <Field
          name="filter"
          component={FilterField}
          validate={ruleValidator}
        />
      </IssueAnchor>
    </Section>
  );
};

export default Filter;
