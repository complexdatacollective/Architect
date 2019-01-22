import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import window from '../../ui/components/window';
import Fade from '../../ui/components/Transitions/Fade';

class PromptWindow extends PureComponent {
  static propTypes = {
    show: PropTypes.bool,
    children: PropTypes.node,
    onBlur: PropTypes.func.isRequired,
  };

  static defaultProps = {
    show: false,
    children: null,
  };

  render() {
    const {
      show,
      children,
      onBlur,
    } = this.props;

    return (
      <Fade in={show}>
        <div className="modal">
          <div className="modal__background" onClick={onBlur} />
          <div className="modal__content">
            {children}
          </div>
        </div>
      </Fade>
    );
  }
}

export default window(PromptWindow);
