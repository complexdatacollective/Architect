import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Icon } from 'network-canvas-ui';

class SeamlessTextInput extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
    value: '',
    onChange: () => {},
  };

  constructor(props) {
    super(props);

    this.state = { hasFocus: false };
  }

  componentDidMount() {
    this.updateFocus();
  }

  onChange = () => {
    this.props.onChange(this.input.value);
  }

  onFocusChange = () => {
    this.updateFocus();
  }

  updateFocus() {
    this.setState({
      hasFocus: (document.activeElement === this.input),
    });
  }

  render() {
    const {
      value,
      className,
    } = this.props;

    return (
      <div className={cx('seamless-text-input', className, { 'seamless-text-input--has-focus': this.state.hasFocus })}>
        <input
          className={cx('seamless-text-input__input')}
          value={value}
          type="text"
          ref={(input) => { this.input = input; }}
          onChange={() => { this.onChange(this.input.value); }}
          onFocus={this.onFocusChange}
          onBlur={this.onFocusChange}
        />
        <Icon name="edit" className="seamless-text-input__icon" />
      </div>
    );
  }
}

export default SeamlessTextInput;
