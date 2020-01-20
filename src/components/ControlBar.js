import React from 'react';
import { TransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Fade from '@codaco/ui/lib/components/Transitions/Fade';

const ControlBar = ({ buttons, secondaryButtons, flip, show, className }) => {
  const buttonLayout = [
    <div className="control-bar__primary-buttons" key="primary">
      <TransitionGroup component={null}>
        { buttons &&
          Array.from(buttons).map(button =>
            <Fade key={button.key} in={show}>{button}</Fade>)
        }
      </TransitionGroup>
    </div>,
    <div className="control-bar__secondary-buttons" key="secondary">
      <TransitionGroup component={null}>
        { secondaryButtons &&
          Array.from(secondaryButtons).map(button =>
            <Fade key={button.key} in={show}>{button}</Fade>)
        }
      </TransitionGroup>
    </div>,
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
};

ControlBar.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.node),
  secondaryButtons: PropTypes.arrayOf(PropTypes.node),
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
