import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const ControlBar = ({ buttons, secondaryButtons, flip, show, className }) => {
  const buttonLayout = [
    <div className="control-bar__primary-buttons">{ buttons }</div>,
    <div className="control-bar__secondary-buttons">{ secondaryButtons }</div>,
  ];

  return (
    <div
      className={cx(
        'control-bar',
        {
          'control-bar--show': show,
          'control-bar--flip': flip,
        },
        className,
      )}
    >
      { flip ? buttonLayout.reverse() : buttonLayout }
    </div>
  );
}

ControlBar.propTypes = {
  buttons: PropTypes.node,
  secondaryButtons: PropTypes.node,
  className: PropTypes.string,
  show: PropTypes.bool,
  flip: PropTypes.bool,
};

ControlBar.defaultProps = {
  buttons: null,
  secondaryButtons: null,
  className: '',
  show: true,
  flip: false,
};

export { ControlBar };

export default ControlBar;
