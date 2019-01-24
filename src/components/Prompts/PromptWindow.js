import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Flipped } from 'react-flip-toolkit';

class PromptWindow extends PureComponent {
  static propTypes = {
    show: PropTypes.bool,
    children: PropTypes.node,
    editField: PropTypes.string,
  };

  static defaultProps = {
    show: false,
    editField: null,
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
      editField,
    } = this.props;

    return ReactDOM.createPortal(
      (
        show &&
        <Flipped flipId={editField}>
          <div className="prompts-prompt-window" onClick={e => e.stopPropagation()}>
            <div className="prompts-prompt-window__content ">
              {children}
            </div>
          </div>
        </Flipped>
      ),
      this.portal,
    );
  }
}

export default PromptWindow;
