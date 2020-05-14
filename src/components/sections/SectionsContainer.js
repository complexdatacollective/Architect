import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const SectionsContainer = ({
  children,
  className,
  ...rest
}) => {
  const containerClasses = cx(
    className,
    'stage-editor',
  );

  return (
    <div className={containerClasses} {...rest}>
      {children}
    </div>
  );
};

SectionsContainer.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

SectionsContainer.defaultProps = {
  className: '',
};

export default SectionsContainer;
