import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import windowRootConsumer from '@codaco/ui/lib/components/windowRootConsumer';

const getDisplayName = (WrappedComponent) => WrappedComponent.displayName || WrappedComponent.name || 'Component';

/*
 * HOC which will cause a component to be rendered outside of the main ReactDOM hierarchy,
 * useful for modals and other windowed components.
 */
const window = (forceRoot) => (WrappedComponent) => {
  const Window = (props) => {
    const { windowRoot } = props;
    const portal = forceRoot || windowRoot;
    // const portal = windowRoot;

    return ReactDOM.createPortal(
      // eslint-disable-next-line react/jsx-props-no-spreading
      <WrappedComponent {...props} />,
      portal,
    );
  };

  Window.displayName = () => `Window(${getDisplayName(WrappedComponent)})`;

  Window.propTypes = {
    windowRoot: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  };

  Window.defaultProps = {
    windowRoot: null,
  };

  return windowRootConsumer(Window);
};

export default window;
