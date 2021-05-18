import React, { useState, useCallback } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

const Details = ({
  summary,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(
    () => setIsOpen((s) => !s),
    [setIsOpen],
  );

  return (
    <div className={cx('details', { 'details--is-open': isOpen })}>
      <div className="details__summary" onClick={toggleOpen}>
        {summary}
      </div>
      <div className="details__content">
        {children}
      </div>
    </div>
  );
};

Details.propTypes = {
  children: PropTypes.node,
  summary: PropTypes.node,
};

Details.defaultProps = {
  children: null,
  summary: 'Open',
};

export default Details;
