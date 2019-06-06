import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Guidance from '../Guidance';

const Section = ({
  disabled,
  group,
  compactNext,
  children,
  className,
  contentId,
  focus,
}) => {
  const sectionClasses = cx(
    className,
    'stage-editor-section',
    { 'stage-editor-section--disabled': disabled },
    { 'stage-editor-section--group': group },
    { 'stage-editor-section--compact-next': compactNext },
  );

  if (contentId) {
    return (
      <Guidance
        contentId={contentId}
        className={sectionClasses}
        focus={focus}
      >
        {children}
      </Guidance>
    );
  }

  return (
    <div
      className={sectionClasses}
    >
      {children}
    </div>
  );
};

Section.propTypes = {
  disabled: PropTypes.bool,
  group: PropTypes.bool,
  compactNext: PropTypes.bool,
  className: PropTypes.string,
  contentId: PropTypes.string,
  focus: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

Section.defaultProps = {
  contentId: null,
  disabled: false,
  group: false,
  className: '',
  focus: false,
  compactNext: false,
};

export default Section;
