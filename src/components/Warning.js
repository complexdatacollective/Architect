import React from 'react';
import propTypes from 'prop-types';
import Window from './Window';

const Warning = ({ children, show }) => (
  <Modal show={show}>
    {({close, isVisible}) => (
      <div>
        <div>title</div>
        {children}
        <div>buttons</div>
      </div>
    )}
  </Modal>
);

Dialog.propTypes = {
  show: propTypes.bool,
  children: propTypes.element,
};

Dialog.defaultProps = {
  show: false,
  children: null,
};

export { Dialog };

export default Window(Dialog);

const usage = () => (
  <Warning show={show} title="Some kind of warning" onConfirm={}>
    Message here!
  </Warning>
);

const Warning = ({ show, title, onConfirm }) => (
  <Dialog show={show} title="Some kind of warning" onConfirm={}>
    {title}

    Message here!

    <Button onClick={onConfirm}/>
  </Dialog>
);
