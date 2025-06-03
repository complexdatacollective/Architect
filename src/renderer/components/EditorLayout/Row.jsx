import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const Row = ({
  disabled,
  children,
}) => {
  const rowClasses = cx(
    'stage-editor-row',
    { 'stage-editor-row--disabled': disabled },
  );

  return (
    <div className={rowClasses}>
      {children}
    </div>
  );
};

Row.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.node,
};

Row.defaultProps = {
  disabled: false,
  children: null,
};

export default Row;
