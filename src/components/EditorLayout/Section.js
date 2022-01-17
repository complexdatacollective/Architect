import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@codaco/ui';
import cx from 'classnames';
import { Toggle } from '@codaco/ui/lib/components/Fields';

const animations = {
  collapsed: {
    height: 0,
    opacity: 0,
  },
  open: {
    height: 'auto',
    opacity: 1,
  },
};

const Section = ({
  title,
  summary,
  disabled,
  group,
  children,
  className,
  toggleable,
  startExpanded,
}) => {
  const [isOpen, setIsOpen] = useState(startExpanded);

  const toggleOpen = useCallback(
    () => setIsOpen((s) => !s),
    [setIsOpen],
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
    <fieldset className={sectionClasses}>
      <legend
        className={toggleable ? 'toggleable' : ''}
      >
        { toggleable && (
          <Toggle input={{
            value: isOpen,
            onChange: toggleOpen,
          }}
          />
        )}
        {title}
        {!toggleable && (
          <span style={{ color: 'var(--error)' }}> *</span>
        )}
      </legend>
      <div className="summary">
        { summary }
      </div>
      <AnimatePresence>
        { (isOpen || !toggleable) && (
          <motion.div
            variants={animations}
            initial="collapsed"
            animate="open"
            exit="collapsed"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </fieldset>
  );
};

Section.propTypes = {
  toggleable: PropTypes.bool,
  startExpanded: PropTypes.bool,
  title: PropTypes.string.isRequired,
  summary: PropTypes.node,
  disabled: PropTypes.bool,
  group: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Section.defaultProps = {
  summary: null,
  toggleable: false,
  startExpanded: true,
  disabled: false,
  group: false,
  className: '',
};

export default Section;
