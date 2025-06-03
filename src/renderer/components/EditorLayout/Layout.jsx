import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const Layout = ({
  children,
  className,
  ...rest
}) => {
  const containerClasses = cx(
    className,
    'stage-editor',
  );

  return (
    <div
      className={containerClasses}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    >
      {children}
    </div>
  );
};

Layout.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Layout.defaultProps = {
  className: '',
};

export default Layout;
