import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Icon } from '../../ui/components';
import { getCSSVariableAsNumber } from '../../utils/CSSVariables';

const Guidance = ({
  handleClickToggle,
  guidance: { id, content },
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
        <div className="guided-guidance__guidance-container">
          <TransitionGroup component={null}>
            <CSSTransition
              key={id}
              timeout={{
                enter: getCSSVariableAsNumber('--animation-duration-slow-ms') + getCSSVariableAsNumber('--animation-duration-fast-ms'),
                exit: getCSSVariableAsNumber('--animation-duration-fast-ms'),
              }}
              classNames="guided-guidance__tween"
            >
              <div className="guided-guidance__guidance">
                {content}
              </div>
            </CSSTransition>
          </TransitionGroup>
        </div>
      </div>
      <div
        className="guided-guidance__toggle"
        onClick={handleClickToggle}
      >
        <Icon
          name="chevron-right"
          color="white"
          className="guided-guidance__toggle-icon guided-guidance__toggle-icon--close"
        />
        <Icon
          name="chevron-left"
          color="white"
          className="guided-guidance__toggle-icon guided-guidance__toggle-icon--open"
        />
      </div>
    </div>
  );
};

Guidance.propTypes = {
  className: PropTypes.string,
  guidance: PropTypes.object,
  show: PropTypes.bool,
  handleClickToggle: PropTypes.func,
};

Guidance.defaultProps = {
  className: '',
  guidance: { id: null, content: null },
  show: false,
  handleClickToggle: () => {},
};

export default Guidance;
