import React, { Component } from 'react';
import propTypes from 'prop-types';
import cx from 'classnames';

class Modal extends Component {
  static propTypes = {
    show: propTypes.bool,
    children: propTypes.element,
  };

  static defaultProps = {
    show: true,
    children: null,
  };

  constructor(props) {
    super(props);

    this.state = { show: true };
  }

  componentWillReceiveProps(newProps) {
    this.setState({ show: newProps.show });
  }

  render() {
    const { show, children } = this.props;

    const modalClasses = cx(
      'modal',
      { 'modal--is-visible': show },
    );

    return (
      <div className={modalClasses}>
        <div className="modal__background" />
        <div className="modal__content">{ children }</div>
      </div>
    );
  }
}

export { Modal };

export default Modal;
