import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Handle from './Handle';

class Prompt extends Component {
  static propTypes = {
    className: PropTypes.string,
    open: PropTypes.bool,
    handleDelete: PropTypes.func.isRequired,
    children: PropTypes.node,
  };

  static defaultProps = {
    className: null,
    open: false,
    preview: null,
    children: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  componentWillMount() {
    this.setState({ isOpen: this.props.open });
  }

  handleToggleOpen = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    const { children, handleDelete } = this.props;

    const promptClasses = cx(
      'stage-editor-section-prompt',
      { 'stage-editor-section-prompt--open': this.state.isOpen },
      this.props.className,
    );

    return (
      <div className={promptClasses}>
        <div className="stage-editor-section-prompt__editor">
          <Handle />

          {children}

          <div onClick={handleDelete}>delete</div>
        </div>
      </div>
    );
  }
}

export { Prompt };

export default Prompt;
