/* eslint-disable */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Icon } from 'network-canvas-ui';

class SeamlessTextInput extends PureComponent {
  static propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
  };

  static defaultProps = {
    input: {},
    meta: {},
  };

  render() {
    const {
      input,
      meta: { dirty, error, warning },
      className,
      placeholder,
      type,
    } = this.props;

    return (
      <div className={cx('seamless-text-input', className, { 'seamless-text-input--has-focus': input.active })}>
        <input
          className={cx('seamless-text-input__input')}
          placeholder={placeholder}
          type={type}
          {...input}
        />
        <Icon name="edit" className="seamless-text-input__icon" />
        {dirty && error}
      </div>
    );
  }
}

export default SeamlessTextInput;
