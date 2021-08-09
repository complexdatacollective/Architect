import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import cx from 'classnames';
import { getCSSVariableAsNumber } from '@codaco/ui/lib/utils/CSSVariables';
import Stackable from '@components/Stackable';
import window from '@app/behaviours/window';

const Window2 = ({
  show,
  title,
  children,
  leftControls,
  rightControls,
  className,
}) => {
  if (!show) { return null; }

  const dialogZIndex = getCSSVariableAsNumber('--z-dialog');

  return (
    <Stackable stackKey>
      {({ stackIndex }) => (
        <div
          className={cx('window', className)}
          style={{
            zIndex: dialogZIndex + stackIndex,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="window__container">
            { title && (
              <div className="window__heading">
                <h3>{title}</h3>
              </div>
            )}
            <div className="window__main">
              <div className="window__content">
                {children}
              </div>
            </div>
            <div className="window__controls">
              { leftControls && (
                <div className="window__controls-left">
                  {leftControls}
                </div>
              )}
              { rightControls && (
                <div className="window__controls-right">
                  {rightControls}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Stackable>
  );
};

Window2.propTypes = {
  show: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.node,
};

Window2.defaultProps = {
  title: null,
  show: true,
  children: null,
};

export default compose(
  window(document.body),
)(Window2);
