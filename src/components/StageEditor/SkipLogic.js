import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { has } from 'lodash';
import { change, getFormValues } from 'redux-form';
import { actionCreators as dialogActions } from '@modules/dialogs';
import ContextPanel from '@components/ContextPanel';
import SkipLogicFields from '@components/sections/fields/SkipLogicFields';

const SkipLogic = ({
  hasSkipLogic,
  changeField,
  openDialog,
}) => {
  const handleDeactivate = useCallback(
    () => {
      if (hasSkipLogic) {
        return openDialog({
          type: 'Warning',
          title: 'This will clear your skip logic',
          message: 'This will clear your skip logic, and delete any rules you have created. Do you want to continue?',
          confirmLabel: 'Clear skip logic',
        })
          .then((confirm) => {
            if (confirm) {
              changeField('edit-stage', 'skipLogic', null);
            }
            return confirm;
          });
      }

      changeField('edit-stage', 'skipLogic', null);
      return Promise.resolve(true);
    },
    [openDialog, changeField],
  );

  return (
    <ContextPanel
      title="Enable skip logic for this stage"
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
