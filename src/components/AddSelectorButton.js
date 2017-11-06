import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Button } from 'network-canvas-ui';

class AddSelectorButton extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  onShowAddChoices = () => { this.setState({ isOpen: true }); };
  onHideAddChoices = () => { this.setState({ isOpen: false }); };

  render() {
    return (
      <div
        className={cx('edit-skip__add', { 'edit-skip__add--is-open': this.state.isOpen })}
        onMouseLeave={this.onHideAddChoices}
      >
        <Button
          className="button edit-skip__add-open"
          onMouseEnter={this.onShowAddChoices}
          disabled
        >
          +
        </Button>

        <div className="edit-skip__add-choices">
          <Button
            size="small"
            onClick={() => { this.onHideAddChoices(); this.props.onAddSelector('alter'); }}
          >
          Alter
          </Button>
          <Button
            size="small"
            onClick={() => { this.onHideAddChoices(); this.props.onAddSelector('ego'); }}
          >
          Ego
          </Button>
          <Button
            size="small"
            onClick={() => { this.onHideAddChoices(); this.props.onAddSelector('edge'); }}
          >
          Edge
          </Button>
        </div>
      </div>
    );
  }
}

AddSelectorButton.propTypes = {
  onAddSelector: PropTypes.func.isRequired,
};

export default AddSelectorButton;
