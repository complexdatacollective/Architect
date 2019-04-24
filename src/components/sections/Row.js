import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Guidance from '../Guidance';

const Row = ({
  disabled,
  contentId,
  children,
  ...rest
}) => {
  const rowClasses = cx(
    'stage-editor-row',
    { 'stage-editor-row--disabled': disabled },
  );

  if (contentId) {
    return (
      <Guidance contentId={contentId} className={rowClasses} {...rest}>
        {children}
      </Guidance>
    );
  }

  return (
    <div className={rowClasses} {...rest}>
      {children}
    </div>
  );
};

Row.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

Row.defaultProps = {
  disabled: false,
};

export default Row;
