import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

const Editor = ({ isActive, showGuidance, children, className, disabled, ...props }) => {
  const editorClasses = cx(
    className,
    'guided-editor',
    {
      'guided-editor--is-active': isActive,
      'guided-editor--disabled': disabled,
    },
  );

  return (
    <div
      className={editorClasses}
      onMouseEnter={showGuidance}
      {...props}
    >
      {children}
    </div>
  );
};

Editor.propTypes = {
  isActive: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  showGuidance: PropTypes.func,
};

Editor.defaultProps = {
  isActive: false,
  className: '',
  children: null,
  disabled: false,
  showGuidance: () => {},
};

export default Editor;
