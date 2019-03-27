import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const Section = ({
  disabled,
  group,
  children,
  ...rest
}) => {
  const sectionClasses = cx(
    'stage-editor-section',
    { 'stage-editor-section--disabled': disabled },
    { 'stage-editor-section--group': group },
  );

  return (
    <div
      className={sectionClasses}
      {...rest}
    >
      {children}
    </div>
  );
};

Section.propTypes = {
  disabled: PropTypes.bool,
  group: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

Section.defaultProps = {
  disabled: false,
  group: false,
};

export default Section;
