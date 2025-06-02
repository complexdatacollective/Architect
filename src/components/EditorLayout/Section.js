import React, {
  useState, useCallback, useEffect, forwardRef,
} from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';
import cx from 'classnames';
import { Toggle } from '@codaco/ui/lib/components/Fields';
import IssueAnchor from '../IssueAnchor';

const animations = {
  collapsed: {
    overflow: 'hidden',
    height: 0,
    opacity: 0,
  },
  open: {
    overflow: 'visible',
    height: 'auto',
    opacity: 1,
  },
};

const Section = forwardRef(({
  id,
  title,
  summary,
  disabled,
  group,
  children,
  className,
  toggleable,
  startExpanded,
  handleToggleChange,
}, ref) => {
  const [isOpen, setIsOpen] = useState(startExpanded);

  // If the startExpanded prop changes, update the state.
  // This happens when a stage is reset
  useEffect(() => {
    setIsOpen(startExpanded);
  }, [startExpanded]);

  const changeToggleState = useCallback(
    async () => {
      // Save the intended state here, so that if startExpanded changes
      // in the meantime, we don't inadvertently change the open state
      // back.
      const intendedState = !isOpen;
      const result = await handleToggleChange(!isOpen);

      // If result of the callback, update the state with intendedState
      if (result) {
        setIsOpen(intendedState);
      }
    },
    [isOpen, setIsOpen, handleToggleChange],
  );

  const sectionClasses = cx(
    'stage-editor-section',
    { 'stage-editor-section--toggleable': toggleable },
    { 'stage-editor-section--open': isOpen },
    { 'stage-editor-section--disabled': disabled },
    { 'stage-editor-section--group': group },
    className,
  );

  return (
    <fieldset className={sectionClasses} ref={ref}>
      <legend
        className={toggleable ? 'toggleable' : ''}
      >
        {toggleable && (
          <Toggle
            input={{
              value: isOpen,
              onChange: changeToggleState,
            }}
            title="Turn this feature on or off"
          />
        )}
        {title}
        {!toggleable && (
          <span style={{ color: 'var(--error)' }}> *</span>
        )}
      </legend>
      <div className="summary">
        {summary}
      </div>
      {id && (
        <IssueAnchor fieldName={id} description={title} />
      )}
      <AnimatePresence initial={false}>
        {(isOpen || !toggleable) && (
          <motion.div
            variants={animations}
            initial="collapsed"
            animate="open"
            exit="collapsed"
            transition={{ duration: 0.2, type: 'easeInOut' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </fieldset>
  );
});

Section.propTypes = {
  id: PropTypes.string,
  toggleable: PropTypes.bool,
  startExpanded: PropTypes.bool,
  title: PropTypes.string.isRequired,
  summary: PropTypes.node,
  disabled: PropTypes.bool,
  group: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  handleToggleChange: PropTypes.func,
};

Section.defaultProps = {
  id: null,
  summary: null,
  toggleable: false,
  startExpanded: true,
  disabled: false,
  group: false,
  className: '',
  handleToggleChange: () => Promise.resolve(true),
};

export default Section;
