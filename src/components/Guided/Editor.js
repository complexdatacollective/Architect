import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

const Editor = ({ isActive, children, className, disabled, ...props }) => {
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
};

Editor.defaultProps = {
  isActive: false,
  className: '',
  children: null,
  disabled: false,
};

export default Editor;
