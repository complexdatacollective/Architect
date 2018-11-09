import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Icon } from '../../ui/components';
import Handle from './Handle';
import DeleteButton from './DeleteButton';

class ExpandableItem extends Component {
  static propTypes = {
    className: PropTypes.string,
    open: PropTypes.bool,
    sortable: PropTypes.bool,
    lockOpen: PropTypes.bool,
    handleDelete: PropTypes.func.isRequired,
    preview: PropTypes.node,
    children: PropTypes.node,
  };

  static defaultProps = {
    className: null,
    sortable: true,
    open: false,
    lockOpen: false,
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
    this.setState({ isOpen: this.props.open || this.props.lockOpen });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.lockOpen) { this.setState({ isOpen: true }); return; }
    if (newProps.open !== this.props.open) { this.setState({ isOpen: newProps.open }); }
  }

  handleToggleOpen = () => {
    if (this.props.lockOpen) { return; }
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    const {
      sortable,
      preview,
      children,
      handleDelete,
    } = this.props;

    const componentClasses = cx(
      'list-expandable-item',
      { 'list-expandable-item--open': this.state.isOpen },
      { 'list-expandable-item--lock': this.props.lockOpen },
      this.props.className,
    );

    return (
      <div className={componentClasses}>
        <div className="list-expandable-item__preview">
          { sortable &&
            <div
              className="list-expandable-item__control list-expandable-item__control--left"
            >
              <Handle />
            </div>
          }
          <div className="list-expandable-item__preview-content">
            {preview}
          </div>
          <div
            className="list-expandable-item__control list-expandable-item__control--right"
          >
            <DeleteButton onClick={handleDelete} />
          </div>
        </div>
        <div
          className="list-expandable-item__expand"
          onClick={this.handleToggleOpen}
        >
          <Icon
            name="chevron-down"
            color="white"
            className="list-expandable-item__expand--open"
          />
          <Icon
            name="chevron-up"
            color="white"
            className="list-expandable-item__expand--close"
          />
        </div>
        <div className="list-expandable-item__content">
          {children}
        </div>
      </div>
    );
  }
}

export { ExpandableItem };

export default ExpandableItem;
