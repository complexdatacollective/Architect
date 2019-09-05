import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Guidance from '../Guidance';

const Row = ({
  disabled,
  contentId,
  focus,
  children,
}) => {
  const rowClasses = cx(
    'stage-editor-row',
    { 'stage-editor-row--disabled': disabled },
  );

  if (contentId) {
    return (
      <Guidance
        contentId={contentId}
        className={rowClasses}
        focus={focus}
      >
        {children}
      </Guidance>
    );
  }

  return (
    <div className={rowClasses}>
      {children}
    </div>
  );
};

Row.propTypes = {
  disabled: PropTypes.bool,
  contentId: PropTypes.string,
  focus: PropTypes.bool,
  children: PropTypes.node,
};

Row.defaultProps = {
  focus: false,
  contentId: null,
  disabled: false,
  children: null,
};

export default Row;
