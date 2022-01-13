import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Icon } from '@codaco/ui';
import cx from 'classnames';

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
    { 'stage-editor-section--disabled': disabled },
    { 'stage-editor-section--group': group },
    className,
  );

  return (
    <fieldset className={sectionClasses}>
      <legend
        onClick={() => toggleable && toggleOpen()}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
        role="button"
        className={toggleable ? 'toggleable' : ''}
      >
        { toggleable && (!isOpen ? (<Icon name="chevron-right" />) : (<Icon name="chevron-down" />)) }
        {title}
        {!toggleable && (
          <span style={{ color: 'var(--error)' }}> *</span>
        )}
      </legend>
      { summary }
      <motion.div
        variants={animations}
        initial={toggleable ? 'collapsed' : 'open'}
        animate={(isOpen ? 'open' : 'collapsed')}
      >
        {children}
      </motion.div>
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
