import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { change as changeField, getFormValues } from 'redux-form';
import { has } from 'lodash';
import { motion } from 'framer-motion';
import Checkbox from '@codaco/ui/lib/components/Fields/Checkbox';
import { actionCreators as dialogActions } from '@modules/dialogs';
import SkipLogicFields from '@components/SkipLogicEditor/SkipLogicFields';

const SkipLogic = ({
  hasSkipLogic,
  changeField,
  openDialog,
}) => {
  const [open, setOpen] = useState(hasSkipLogic);

  const panelVariants = useMemo(() => ({
    activated: { height: '100%', opacity: 1 },
    unactivated: { height: 0, opacity: 0 },
  }), []);

  const resetSkipLogic = () => {
    changeField('edit-stage', 'skipLogic', {});
    setOpen(false);
  };

  const handleActivate = useCallback(() => {
    if (!open) {
      setOpen(true);
      return;
    }

    openDialog({
      type: 'Warning',
      title: 'This will clear skip logic',
      confirmLabel: 'Clear skip logic',
    })
      .then((confirm) => {
        if (!confirm) { return; }
        resetSkipLogic();
      });
  }, [openDialog, open, setOpen]);

  const variant = open ? 'activated' : 'unactivated';

  return (
    <motion.div
      initial="unactivated"
      animate={variant}
      className="context-drawer"
    >
      <motion.div
        className="context-drawer__controls"
      >
        <Checkbox
          input={{ value: open }}
          onClick={handleActivate}
        />
        Skip Logic
      </motion.div>
      <motion.div
        className="context-drawer__panel"
        variants={panelVariants}
      >
        <div className="context-drawer__panel-container">
          <SkipLogicFields />
        </div>
      </motion.div>
    </motion.div>
  );
};

const mapStateToProps = state => ({
  hasSkipLogic: has(getFormValues('edit-stage')(state), 'skipLogic.action'),
});

const mapDispatchToProps = {
  openDialog: dialogActions.openDialog,
  changeField,
};

export { SkipLogic };

export default connect(mapStateToProps, mapDispatchToProps)(SkipLogic);
