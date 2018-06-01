import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { propTypes, defaultProps } from './guidedProps';

const Editor = ({
  isActive,
  showGuidance,
  resetGuidance,
  toggleGuidance,
  anyActive,
  children,
  className,
  disabled,
  ...props
}) => {
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
      onMouseLeave={resetGuidance}
      {...props}
    >
      {children}
    </div>
  );
};

Editor.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  ...propTypes,
};

Editor.defaultProps = {
  className: '',
  children: null,
  disabled: false,
  ...defaultProps,
};

export default Editor;
