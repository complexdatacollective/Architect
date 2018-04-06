import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Icon } from 'network-canvas-ui';
import { fieldPropTypes } from 'redux-form';

class SeamlessTextInput extends PureComponent {
  static propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
    className: PropTypes.string,
    ...fieldPropTypes,
  };

  static defaultProps = {
    input: {},
    meta: {},
    className: '',
  };

  render() {
    const {
      input,
      meta: { error, active },
      className,
      placeholder,
      type,
    } = this.props;

    const seamlessClasses = cx(
      className,
      'seamless-text-input',
      {
        'seamless-text-input--has-focus': active,
        'seamless-text-input--has-error': error,
      },
    );

    return (
      <div className={seamlessClasses}>
        <input
          className="seamless-text-input__input"
          placeholder={placeholder}
          type={type}
          {...input}
        />
        <Icon name="edit" className="seamless-text-input__icon seamless-text-input__icon--edit" />
        <Icon name="close" className="seamless-text-input__icon seamless-text-input__icon--error" />
        <p className="seamless-text-input__error">{error}</p>
      </div>
    );
  }
}

export default SeamlessTextInput;
