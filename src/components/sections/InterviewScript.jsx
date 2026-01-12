import React, { useCallback } from 'react';
import { Section } from '@components/EditorLayout';
import { change, Field, formValueSelector } from 'redux-form';
import { Field as RichText } from '@codaco/ui/lib/components/Fields/RichText';
import { actionCreators as dialogActions } from '@modules/dialogs';
import { useDispatch, useSelector } from 'react-redux';
import IssueAnchor from '../IssueAnchor';

const InterviewerScript = () => {
  const getFormValue = formValueSelector('edit-stage');
  const currentValue = useSelector((state) => getFormValue(state, 'interviewScript'));
  const dispatch = useDispatch();
  const openDialog = useCallback(
    (dialog) => dispatch(dialogActions.openDialog(dialog)),
    [dispatch],
  );

  const handleToggleChange = useCallback(
    async (newState) => {
      if (!currentValue || newState === true) {
        return true;
      }

      const confirm = await openDialog({
        type: 'Warning',
        title: 'This will clear your interview script',
        message: 'This will clear your interview script, and delete content you previously entered. Do you want to continue?',
        confirmLabel: 'Clear script',
      });

      if (confirm) {
        dispatch(change('edit-stage', 'interviewScript', null));
        return true;
      }

      return false;
    },
    [dispatch, openDialog, currentValue],
  );

  return (
    <Section
      className="interview-script"
      title="Interviewer Script"
      summary={(
        <p>
          Use this section to create notes or a guide for the interviewer.
        </p>
      )}
      toggleable
      startExpanded={!!currentValue}
      handleToggleChange={handleToggleChange}
    >
      <IssueAnchor fieldName="interviewScript" description="Interview script">
        <Field
          name="interviewScript"
          component={RichText}
          placeholder="Enter text for the interviewer here."
        />
      </IssueAnchor>
    </Section>
  );
};

export default InterviewerScript;
