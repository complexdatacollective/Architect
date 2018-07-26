import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Icon } from '../../ui/components';
import DeleteButton from './DeleteButton';

class ExpandablePrompt extends Component {
  static propTypes = {
    className: PropTypes.string,
    open: PropTypes.bool,
    handleDelete: PropTypes.func.isRequired,
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

    const componentClasses = cx(
      'items-expandable-item',
      { 'items-expandable-item--open': this.state.isOpen },
      this.props.className,
    );

    return (
      <div className={componentClasses}>
        <div className="items-expandable-item__preview">
          <div className="items-expandable-item__preview-content">
            {preview}
          </div>
          <div
            className="items-expandable-item__control items-expandable-item__control--right"
          >
            <DeleteButton onClick={handleDelete} />
          </div>
        </div>
        <div
          className="items-expandable-item__expand"
          onClick={this.handleToggleOpen}
        >
          <Icon
            name="chevron-down"
            color="white"
            className="items-expandable-item__expand--open"
          />
          <Icon
            name="chevron-up"
            color="white"
            className="items-expandable-item__expand--close"
          />
        </div>
        <div className="items-expandable-item__content">
          {children}
        </div>
      </div>
    );
  }
}

export { ExpandablePrompt };

export default ExpandablePrompt;
