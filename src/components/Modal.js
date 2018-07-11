import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import propTypes from 'prop-types';
import cx from 'classnames';
import Fade from './Transitions/Fade';
import Drop from './Transitions/Drop';

class Modal extends Component {
  static propTypes = {
    show: propTypes.bool,
    children: propTypes.element,
  };

  static defaultProps = {
    show: false,
    children: null,
  };

  constructor(props) {
    super(props);

    this.portal = document.createElement('div');
    const body = document.getElementsByTagName('body')[0];
    body.appendChild(this.portal);

    this.state = { show: false };
  }

  componentWillReceiveProps(newProps) {
    this.setState({ show: newProps.show });
  }

  render() {
    const { show, children } = this.props;

    const modalClasses = cx(
      'modal',
    );

    return ReactDOM.createPortal(
      (
        <Fade className={modalClasses} in={show}>
          <div>
            <div className="modal__background" />
            <div className="modal__content">
              <Drop in>
                { children }
              </Drop>
            </div>
          </div>
        </Fade>
      ),
      this.portal,
    );
  }
}

export { Modal };

export default Modal;
