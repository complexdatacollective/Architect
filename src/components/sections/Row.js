import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const Row = ({
  disabled,
  children,
  ...rest
}) => {
  const rowClasses = cx(
    'stage-editor-row',
    { 'stage-editor-row--disabled': disabled },
  );

  return (
    <div
      className={rowClasses}
      {...rest}
    >
      {children}
    </div>
  );
};

Row.propTypes = {
  disabled: PropTypes.bool,
  group: PropTypes.bool,
  compactNext: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

Row.defaultProps = {
  disabled: false,
  group: false,
  compactNext: false,
};

export default Row;
