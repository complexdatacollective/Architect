import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { has } from 'lodash';
import { change, getFormValues } from 'redux-form';
import { actionCreators as dialogActions } from '@modules/dialogs';
import ContextPanel from '@components/ContextPanel';
import SkipLogicFields from '@components/SkipLogicEditor/SkipLogicFields';

const SkipLogic = ({
  hasSkipLogic,
  changeField,
  openDialog,
}) => {
  const handleDeactivate = useCallback(
    () =>
      openDialog({
        type: 'Warning',
        title: 'This will clear skip logic',
        confirmLabel: 'Clear skip logic',
      })
        .then((confirm) => {
          changeField('edit-stage', 'skipLogic', {});
          return confirm;
        }),
    [openDialog, changeField],
  );

  return (
    <ContextPanel
      title="Skip Logic (optional)"
      isActive={hasSkipLogic}
      onDeactivate={handleDeactivate}
    >
      <SkipLogicFields />
    </ContextPanel>
  );
};

SkipLogic.propTypes = {
  hasSkipLogic: PropTypes.bool.isRequired,
  changeField: PropTypes.func.isRequired,
  openDialog: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  hasSkipLogic: has(getFormValues('edit-stage')(state), 'skipLogic.action'),
});

const mapDispatchToProps = {
  openDialog: dialogActions.openDialog,
  changeField: change,
};

export { SkipLogic };

export default connect(mapStateToProps, mapDispatchToProps)(SkipLogic);
