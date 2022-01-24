import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const Tag = ({
  id,
  children,
  color,
  onClick,
  selected,
  light,
}) => {
  const componentClasses = cx(
    'tag',
    {
      'tag--selected': selected,
      'tag--light': light,
      'tag--clickable': !!onClick,
    },
  );

  const dotClasses = `tag__dot tag__dot--${color}`;

  return (
    <div
      className={componentClasses}
      onClick={() => onClick(id)}
    >
      <div className={dotClasses} />
      <div className="tag__label">
        {children}
      </div>
    </div>
  );
};

Tag.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node,
  color: PropTypes.string,
  onClick: PropTypes.func,
  selected: PropTypes.bool,
  light: PropTypes.bool,
};

Tag.defaultProps = {
  children: null,
  color: null,
  onClick: null,
  selected: false,
  light: false,
};

export default Tag;
