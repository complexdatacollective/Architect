import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';
import cx from 'classnames';
import { Toggle } from '@codaco/ui/lib/components/Fields';
import IssueAnchor from '../IssueAnchor';

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
}) => {
  const [isOpen, setIsOpen] = useState(startExpanded);

  const changeToggleState = useCallback(
    async () => {
      const result = await handleToggleChange(!isOpen);
      if (result) {
        setIsOpen((prevState) => !prevState);
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
    <fieldset className={sectionClasses}>
      <legend
        className={toggleable ? 'toggleable' : ''}
      >
        { id && (
          <IssueAnchor fieldName={id} description={title} />
        )}
        { toggleable && (
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
        { summary }
      </div>
      <AnimatePresence initial={false}>
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
  handleToggleChange: PropTypes.func,
};

Section.defaultProps = {
  summary: null,
  toggleable: false,
  startExpanded: true,
  disabled: false,
  group: false,
  className: '',
  handleToggleChange: () => Promise.resolve(true),
};

export default Section;
