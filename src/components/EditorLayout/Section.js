import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const Section = ({
  disabled,
  group,
  compactNext,
  children,
  className,
}) => {
  const sectionClasses = cx(
    'stage-editor-section',
    { 'stage-editor-section--disabled': disabled },
    { 'stage-editor-section--group': group },
    { 'stage-editor-section--compact-next': compactNext },
    className,
  );

  return (
    <div className={sectionClasses} >
      {children}
    </div>
  );
};

Section.propTypes = {
  disabled: PropTypes.bool,
  group: PropTypes.bool,
  compactNext: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Section.defaultProps = {
  contentId: null,
  disabled: false,
  group: false,
  className: '',
  compactNext: false,
};

export default Section;
