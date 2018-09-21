import React from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';

const Dialog = ({ children, show, options, title, onBlur }) => (
  <Modal show={show} onBlur={onBlur}>
    <div className="dialog">
      <div className="dialog__title">{title}</div>
      <div className="dialog__content">{children}</div>
      <div className="dialog__options">{options}</div>
    </div>
  </Modal>
);

Dialog.propTypes = {
  show: PropTypes.bool,
  children: PropTypes.element,
  title: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.element),
  onBlur: PropTypes.func,
};

Dialog.defaultProps = {
  show: false,
  children: null,
  options: [],
  title: '',
  onBlur: () => {},
};

export { Dialog };

export default Dialog;
