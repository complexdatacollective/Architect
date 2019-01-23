import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Flipped } from 'react-flip-toolkit';
import window from '../../ui/components/window';
import Fade from '../../ui/components/Transitions/Fade';

class PromptWindow extends PureComponent {
  static propTypes = {
    show: PropTypes.bool,
    children: PropTypes.node,
    onBlur: PropTypes.func.isRequired,
    editField: PropTypes.string.isRequired,
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
      editField,
    } = this.props;

    return (
      <Fade in={show}>
        <div className="modal" onClick={onBlur}>
          <div className="modal__background" />
          <div className="modal__content">
            <Flipped flipId={editField}>
              <div className="prompts-prompt-window" onClick={e => e.stopPropagation()}>
                <div className="prompts-prompt-window__content ">
                  {children}
                </div>
              </div>
            </Flipped>
          </div>
        </div>
      </Fade>
    );
  }
}

export default window(PromptWindow);
