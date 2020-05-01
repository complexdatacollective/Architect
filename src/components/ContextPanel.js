import React, { useMemo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Checkbox from '@codaco/ui/lib/components/Fields/Checkbox';

const ContextPanel = ({
  title,
  children,
  isActive,
  onDeactivate,
}) => {
  const panelVariants = useMemo(() => ({
    activated: { height: '100%', opacity: 1 },
    unactivated: { height: 0, opacity: 0 },
  }), []);

  const [open, setOpen] = useState(isActive);

  const handleActivate = useCallback(() => {
    if (!open) {
      setOpen(true);
      return;
    }

    onDeactivate()
      .then((confirm) => {
        if (confirm) { setOpen(false); }
      });
  }, [onDeactivate, open, setOpen]);

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
        {title}
      </motion.div>
      <motion.div
        className="context-drawer__panel"
        variants={panelVariants}
      >
        <div className="context-drawer__panel-container">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

ContextPanel.propTypes = {
  title: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  children: PropTypes.node,
  onDeactivate: PropTypes.func,
};

ContextPanel.defaultProps = {
  onDeactivate: () => Promise.resolve(true),
  children: null,
};

export default ContextPanel;
