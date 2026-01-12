import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import cx from 'classnames';
import { getCSSVariableAsNumber } from '@codaco/ui/lib/utils/CSSVariables';
import Stackable from '@components/Stackable';
import window from '@app/behaviours/window';

const Window = ({
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
              <div className="window__heading stage-heading stage-heading--inline stage-heading--collapsed">
                <div className="stage-editor">
                  <h2>{title}</h2>
                </div>
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

Window.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  leftControls: PropTypes.arrayOf(PropTypes.node),
  rightControls: PropTypes.arrayOf(PropTypes.node),
  show: PropTypes.bool,
  title: PropTypes.string,
};

Window.defaultProps = {
  children: null,
  className: null,
  leftControls: [],
  rightControls: [],
  show: true,
  title: null,
};

export default compose(
  window(document.body),
)(Window);
