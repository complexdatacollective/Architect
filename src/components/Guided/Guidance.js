import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const Guidance = ({
  handleClickToggle,
  guidance,
  show,
  className,
  ...props
}) => {
  const guidanceClasses = cx(
    'guided-guidance',
    { 'guided-guidance--show': show },
  );

  return (
    <div
      className={guidanceClasses}
      {...props}
    >
      <div className="guided-guidance__content">
        <h3>Help</h3>
        { guidance }
      </div>
      <div
        className="guided-guidance__toggle"
        onClick={handleClickToggle}
      />
    </div>
  );
};

Guidance.propTypes = {
  className: PropTypes.string,
  guidance: PropTypes.node,
  show: PropTypes.bool,
  handleClickToggle: PropTypes.func,
};

Guidance.defaultProps = {
  className: '',
  guidance: null,
  show: false,
  handleClickToggle: () => {},
};

export default Guidance;
