import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { SortableHandle } from 'react-sortable-hoc';
import { Icon } from '../../ui/components';

const Handle = SortableHandle(() => (
  <div className="stage-editor-sortable-item__handle" />
));

class Prompt extends Component {
  static propTypes = {
    className: PropTypes.string,
    open: PropTypes.bool,
    preview: PropTypes.node,
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
    const { preview, children, handleDelete } = this.props;

    const promptClasses = cx(
      'stage-editor-section-prompt',
      { 'stage-editor-section-prompt--open': this.state.isOpen },
      this.props.className,
    );

    return (
      <div className={promptClasses}>
        <div className="stage-editor-section-prompt__preview" onClick={this.handleToggleOpen}>
          <div className="stage-editor-section-prompt__preview-content">
            <Handle />

            {preview}

            <a onClick={handleDelete}>delete</a>
          </div>
          <div className="stage-editor-section-prompt__preview-indicator">
            <Icon
              name="chevron-down"
              color="white"
              className="stage-editor-section-prompt__preview-indicator--open"
            />
            <Icon
              name="chevron-up"
              color="white"
              className="stage-editor-section-prompt__preview-indicator--close"
            />
          </div>
        </div>
        <div className="stage-editor-section-prompt__editor">
          {children}
        </div>
      </div>
    );
  }
}

export { Prompt };

export default Prompt;
