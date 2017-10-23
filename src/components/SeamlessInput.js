import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Icon } from 'network-canvas-ui';

class SeamlessInput extends PureComponent {
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
      <div className={cx('seamless-input', className, { 'seamless-input--hasFocus': this.state.focus })}>
        <input
          className={cx('seamless-input__input')}
          value={value}
          type="text"
          ref={(input) => { this.input = input; }}
          onChange={() => { this.onChange(this.input.value); }}
          onFocus={this.onFocusChange}
          onBlur={this.onFocusChange}
        />
        { !this.state.hasFocus && <Icon name="edit" style={{ verticalAlign: 'bottom', width: '20px', height: '20px' }} /> }
      </div>
    );
  }
}

export default SeamlessInput;
