import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Fade from '../Transitions/Fade';

class PromptWindow extends PureComponent {
  static propTypes = {
    show: PropTypes.bool,
    children: PropTypes.node,
  };

  static defaultProps = {
    show: false,
    children: null,
  };

  constructor(props) {
    super(props);

    this.portal = document.createElement('div');
  }

  componentDidMount() {
    this.root.appendChild(this.portal);
  }

  componentWillUnmount() {
    this.root.removeChild(this.portal);
  }

  // eslint-disable-next-line class-methods-use-this
  get root() {
    // If a root reference element is provided by windowRootConsumer() use that,
    // otherwise default to document.body
    return document.getElementById('stage-editor-context') || document.body;
  }

  render() {
    const {
      show,
      children,
    } = this.props;

    return ReactDOM.createPortal(
      (
        <Fade in={show}>
          <div className="prompts-prompt-window" onClick={e => e.stopPropagation()}>
            {show && children}
          </div>
        </Fade>
      ),
      this.portal,
    );
  }
}

export default PromptWindow;
