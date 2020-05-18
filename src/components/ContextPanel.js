import React, { useMemo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';
import Toggle from '@codaco/ui/lib/components/Fields/Toggle';
import { getCSSVariableAsNumber } from '@codaco/ui/lib/utils/CSSVariables';

const ContextPanel = ({
  title,
  variant,
  children,
  isActive,
  onDeactivate,
}) => {
  const variants = useMemo(() => {
    const transition = {
      duration: getCSSVariableAsNumber('--animation-duration-standard-ms') * 0.001,
    };

    return {
      panel: {
        activated: { height: '100%', transition },
        unactivated: { height: 0, transition },
      },
      content: {
        activated: { opacity: 1, transition },
        unactivated: { opacity: 0, transition },
      },
    };
  }, []);

  const [open, setOpen] = useState(isActive);

  const handleActivate = useCallback(() => {
    if (!open) {
      setOpen(true);
      return;
    }

    onDeactivate()
      .then((confirm) => {
        if (confirm) { setOpen(false); }
        return confirm;
      });
  }, [onDeactivate, open, setOpen]);

  const animate = open ? 'activated' : 'unactivated';

  const className = cx(
    'context-panel',
    { [`context-panel--${variant}`]: !!variant },
  );

  return (
    <motion.div
      initial="unactivated"
      animate={animate}
      className={className}
    >
      <motion.div
        className="context-panel__controls"
      >
        <Toggle
          input={{ value: open, onChange: handleActivate }}
          label={title}
        />
      </motion.div>
      <motion.div
        className="context-panel__panel"
        variants={variants.panel}
      >
        <AnimatePresence>
          {open &&
            <motion.div
              className="context-panel__panel-container"
              key="content"
              variants={variants.content}
              initial="unactivated"
              animate={animate}
              exit="unactivated"
            >
              {children}
            </motion.div>
          }
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

ContextPanel.propTypes = {
  title: PropTypes.string.isRequired,
  variant: PropTypes.string,
  isActive: PropTypes.bool.isRequired,
  children: PropTypes.node,
  onDeactivate: PropTypes.func,
};

ContextPanel.defaultProps = {
  variant: '',
  onDeactivate: () => Promise.resolve(true),
  children: null,
};

export default ContextPanel;
