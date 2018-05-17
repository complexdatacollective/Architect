import React from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';


const Fade = ({ children, ...props }) => (
  <Transition
    mountOnEnter
    unmountOnExit
    appear
    timeout={0}
    {...props}
  >
    { children }
  </Transition>
);

Fade.propTypes = {
  children: PropTypes.any,
};

Fade.defaultProps = {
  children: null,
};

export default Fade;
