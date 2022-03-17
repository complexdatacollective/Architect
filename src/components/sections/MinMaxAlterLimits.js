import React, { useCallback, useMemo } from 'react';
import { get, isNull, isUndefined } from 'lodash';
import { Section } from '@components/EditorLayout';
import {
  change, FormSection, formValueSelector,
} from 'redux-form';
import { actionCreators as dialogActions } from '@modules/dialogs';
import { useDispatch, useSelector } from 'react-redux';
import { Number } from '@codaco/ui/lib/components/Fields';
import { ValidatedField } from '../Form';
import IssueAnchor from '../IssueAnchor';

const maxValidation = (value, allValues) => {
  const minValue = get(allValues, 'behaviours.minNodes', null);

  if (isUndefined(minValue) || isNull(minValue) || !value) {
    return undefined;
  }

  return (
    value >= minValue ? undefined : 'Maximum number of alters must be greater than or equal to the minimum number'
  );
};

const minValidation = (value, allValues) => {
  const maxValue = get(allValues, 'behaviours.maxNodes');

  if (isUndefined(maxValue) || isNull(maxValue) || !value) {
    return undefined;
  }

  return (
    value <= maxValue ? undefined : 'Minimum number of alters must be less than or equal to the maximum number'
  );
};

const MinMaxAlterLimits = () => {
  const getFormValue = formValueSelector('edit-stage');
  const currentMinValue = useSelector((state) => getFormValue(state, 'behaviours.minNodes'));
  const currentMaxValue = useSelector((state) => getFormValue(state, 'behaviours.maxNodes'));

  const dispatch = useDispatch();
  const openDialog = useCallback(
    (dialog) => dispatch(dialogActions.openDialog(dialog)),
    [dispatch],
  );

  const handleToggleChange = useCallback(
    async (newState) => {
      if ((isUndefined(currentMinValue) && isUndefined(currentMaxValue)) || newState === true) {
        return true;
      }

      const confirm = await openDialog({
        type: 'Warning',
        title: 'This will clear your values',
        message: 'This will clear the minimum and maximum alter values. Do you want to continue?',
        confirmLabel: 'Clear values',
      });

      if (confirm) {
        dispatch(change('edit-stage', 'behaviours.minNodes', null));
        dispatch(change('edit-stage', 'behaviours.maxNodes', null));
        return true;
      }

      return false;
    },
    [dispatch, openDialog, currentMinValue, currentMaxValue],
  );

  const startExpanded = useMemo(() => !isUndefined(currentMinValue)
    || !isUndefined(currentMaxValue), []);

  return (
    <Section
      title="Set minimum or maximum alter numbers"
      summary={(
        <p>
          This feature allows you to specify that a minimum or maximum number of alters that can
          be named. These limits apply to the stage as a whole, regardless of the number of
          prompts you have.
        </p>
      )}
      toggleable
      startExpanded={startExpanded}
      handleToggleChange={handleToggleChange}
    >
      <FormSection name="behaviours">
        <IssueAnchor fieldName="behaviours.minNodes" description="Minimum alters" />
        <ValidatedField
          name="minNodes"
          label="Minimum Number of Alters. (0 = no minimum)"
          component={Number}
          placeholder="0"
          validation={{
            lessThanMax: minValidation,
            positiveNumber: true,
          }}
        />
        <IssueAnchor fieldName="behaviours.maxNodes" description="Maximum alters" />
        <ValidatedField
          name="maxNodes"
          label="Maximum Number of Alters. _(Leave empty for no maximum)_"
          component={Number}
          placeholder="Infinity"
          validation={{
            greaterThanMin: maxValidation,
            minValue: 1,
          }}
        />
      </FormSection>
    </Section>
  );
};

export default MinMaxAlterLimits;
