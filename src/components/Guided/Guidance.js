import React from 'react';
import PropTypes from 'prop-types';

const Guidance = ({
  handleClickToggle,
  guidance,
  className,
  ...props
}) => (
  <div
    className="guided-guidance"
    {...props}
  >
    <h3>Help</h3>
    { guidance }
    <div
      className="guided-guidance__toggle"
      handleClickToggle={handleClickToggle}
    />
  </div>
);

Guidance.propTypes = {
  className: PropTypes.string,
  guidance: PropTypes.node,
  handleClickToggle: PropTypes.func,
};

Guidance.defaultProps = {
  className: '',
  guidance: null,
  handleClickToggle: () => {},
};

export default Guidance;
