import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { uniqueId } from 'lodash';
import cx from 'classnames';

class TextInput extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    label: PropTypes.string,
    value: PropTypes.string,
  };

  static defaultProps = {
    label: '',
    value: '',
    onChange: () => {},
  };

  componentWillMount() {
    this.id = uniqueId('label');
  }

  onChange = () => {
    this.props.onChange(this.input.value);
  }

  render() {
    const {
      value,
      label,
    } = this.props;

    return (
      <label htmlFor={this.id} className={cx('text-input')}>
        <div className={cx('text-input__label')}>
          {label}
        </div>
        <input
          className={cx('text-input__input')}
          value={value}
          id={this.id}
          type="text"
          onChange={this.onChange}
          ref={(input) => { this.input = input; }}
        />
      </label>
    );
  }
}

export default TextInput;
