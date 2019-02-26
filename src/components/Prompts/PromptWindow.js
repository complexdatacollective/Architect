import React from 'react';
import PropTypes from 'prop-types';
import Fade from '../Transitions/Fade';
import window from '../../ui/components/window';

const PromptWindow = ({
  show,
  children,
}) => (
  <Fade in={show}>
    <div className="prompts-prompt-window" onClick={e => e.stopPropagation()}>
      {show && children}
    </div>
  </Fade>
);

PromptWindow.propTypes = {
  show: PropTypes.bool,
  children: PropTypes.node,
};

PromptWindow.defaultProps = {
  show: false,
  children: null,
};

export default window(PromptWindow);

