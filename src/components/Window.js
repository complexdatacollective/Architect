import React from 'react';
import PropTypes from 'prop-types';
import Fade from '../ui/components/Transitions/Fade';
import window from '../ui/components/window';

const Window = ({
  show,
  children,
}) => (
  <Fade in={show}>
    <div className="editable-list-window" onClick={e => e.stopPropagation()}>
      {show && children}
    </div>
  </Fade>
);

Window.propTypes = {
  show: PropTypes.bool,
  children: PropTypes.node,
};

Window.defaultProps = {
  show: false,
  children: null,
};

export default window(Window);

