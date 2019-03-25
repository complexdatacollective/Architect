import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const Section = ({ disabled, children, ...rest }) => {
  const sectionClasses = cx(
    'stage-editor-section',
    { 'stage-editor-section--disabled': disabled },
  );

  return (
    <div className={sectionClasses} {...rest}>
      {children}
    </div>
  );
};

Section.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

Section.defaultProps = {
  disabled: false,
};

export default Section;
