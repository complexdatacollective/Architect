import { Section } from '@components/EditorLayout';
import SkipLogicFields from '@components/sections/fields/SkipLogicFields';
import { actionCreators as dialogActions } from '@modules/dialogs';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { change, formValueSelector } from 'redux-form';

const handleDeactivateSkipLogic = async (openDialog) => {
  const result = await openDialog({
    type: 'Warning',
    title: 'This will clear your skip logic',
    message:
      'This will clear your skip logic, and delete any rules you have created. Do you want to continue?',
    confirmLabel: 'Clear skip logic',
  });

  return result;
};

const SkipLogicSection = () => {
  const dispatch = useDispatch();
  const openDialog = useCallback(
    (dialog) => dispatch(dialogActions.openDialog(dialog)),
    [dispatch],
  );

  const getFormValue = formValueSelector('edit-stage');
  const hasSkipLogic = useSelector((state) => getFormValue(state, 'skipLogic'));

  const handleToggleChange = useCallback(
    async (newState) => {
      // When turning skip logic on
      if (!hasSkipLogic || newState === true) {
        return true;
      }

      // When turning skip logic off, confirm that the user wants to clear the skip logic
      const confirm = await handleDeactivateSkipLogic(openDialog);

      if (confirm) {
        dispatch(change('edit-stage', 'skipLogic', null));
        return true;
      }

      return false;
    },
    [dispatch, openDialog, hasSkipLogic],
  );

  return (
    <Section
      toggleable
      title="Skip Logic"
      summary={
        <p>
          Use skip logic to determine if this stage should be shown in the
          interview.
        </p>
      }
      startExpanded={!!hasSkipLogic}
      handleToggleChange={handleToggleChange}
    >
      <SkipLogicFields />
    </Section>
  );
};

SkipLogicSection.propTypes = {};

SkipLogicSection.defaultProps = {};

export default SkipLogicSection;
