import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

class AddButton extends PureComponent {
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
        className={cx('rule-add-button', { 'rule-add-button--is-open': this.state.isOpen })}
        onMouseEnter={this.onShowAddChoices}
        onMouseLeave={this.onHideAddChoices}
      >
        <button
          className="rule-add-button__open"
          disabled
        >
          +
        </button>

        <div className="rule-add-button__choices">
          <button
            className="rule-add-button__choice rule-add-button__choice--alter"
            type="button"
            onClick={() => { this.onHideAddChoices(); this.props.onAddRule('alter'); }}
          >
          Alter
          </button>
          <button
            className="rule-add-button__choice rule-add-button__choice--ego"
            type="button"
            onClick={() => { this.onHideAddChoices(); this.props.onAddRule('ego'); }}
          >
          Ego
          </button>
          <button
            className="rule-add-button__choice rule-add-button__choice--edge"
            type="button"
            onClick={() => { this.onHideAddChoices(); this.props.onAddRule('edge'); }}
          >
          Edge
          </button>
        </div>
      </div>
    );
  }
}

AddButton.propTypes = {
  onAddRule: PropTypes.func.isRequired,
};

export default AddButton;
