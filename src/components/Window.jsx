import asWindow from '@app/behaviours/window';
import Stackable from '@components/Stackable';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { compose } from 'redux';

const Window = ({
  show,
  title,
  children,
  leftControls,
  rightControls,
  className,
}) => {
  if (!show) {
    return null;
  }

  return (
    <Stackable stackKey>
      {({ stackIndex: _stackIndex }) => (
        <div
          className={cx('window', className)}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="window__container">
            {title && (
              <div className="window__heading stage-heading stage-heading--inline stage-heading--collapsed">
                <div className="stage-editor">
                  <h2>{title}</h2>
                </div>
              </div>
            )}
            <div className="window__main">
              <div className="window__content">{children}</div>
            </div>
            <div className="window__controls">
              {leftControls && (
                <div className="window__controls-left">{leftControls}</div>
              )}
              {rightControls && (
                <div className="window__controls-right">{rightControls}</div>
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

export default compose(asWindow(document.body))(Window);
