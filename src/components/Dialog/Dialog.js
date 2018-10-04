import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Modal from '../Modal';

const Dialog = ({ children, type, show, options, title, onBlur }) => (
  <Modal show={show} onBlur={onBlur}>
    <div className={cx('dialog', { [`dialog--${type}`]: type })}>
      <div className="dialog__title">{title}</div>
      <div className="dialog__content">{children}</div>
      <div className="dialog__options">{options}</div>
    </div>
  </Modal>
);

Dialog.propTypes = {
  show: PropTypes.bool,
  type: PropTypes.string,
  children: PropTypes.node,
  title: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.element),
  onBlur: PropTypes.func,
};

Dialog.defaultProps = {
  show: false,
  type: null,
  children: null,
  options: [],
  title: '',
  onBlur: () => {},
};

export { Dialog };

export default Dialog;
