import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Icon } from '../../../ui/components';

class SeamlessTextInput extends PureComponent {
  static propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
    className: PropTypes.string,
    type: PropTypes.string,
    placeholder: PropTypes.string,
  };

  static defaultProps = {
    input: {},
    meta: { invalid: false, error: null, touched: false },
    type: 'text',
    placeholder: '',
    className: '',
  };

  render() {
    const {
      input,
      meta: { touched, invalid, error, active },
      className,
      placeholder,
      type,
      ...rest
    } = this.props;

    const seamlessClasses = cx(
      className,
      'form-fields-seamless-text',
      {
        'form-fields-seamless-text--has-focus': active,
        'form-fields-seamless-text--has-error': touched && invalid,
      },
    );

    return (
      <div className={seamlessClasses}>
        <input
          className="form-fields-seamless-text__input"
          placeholder={placeholder}
          type={type}
          {...input}
          {...rest}
        />
        <Icon name="edit" className="form-fields-seamless-text__icon form-fields-seamless-text__icon--edit" />
        <Icon name="close" className="form-fields-seamless-text__icon form-fields-seamless-text__icon--error" />
        <p className="form-fields-seamless-text__error">{error}</p>
      </div>
    );
  }
}

export default SeamlessTextInput;
