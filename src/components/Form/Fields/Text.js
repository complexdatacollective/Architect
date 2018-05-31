import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Icon } from '../../../ui/components';

class TextInput extends PureComponent {
  static propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
    className: PropTypes.string,
    type: PropTypes.string,
    placeholder: PropTypes.string,
  };

  static defaultProps = {
    input: {},
    meta: {},
    type: 'text',
    placeholder: '',
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
      'form-fields-text',
      {
        'form-fields-text--has-focus': active,
        'form-fields-text--has-error': error,
      },
    );

    return (
      <div className={seamlessClasses}>
        <input
          className="form-fields-text__input"
          placeholder={placeholder}
          type={type}
          {...input}
        />
        <Icon name="close" className="form-fields-text__icon form-fields-text__icon--error" />
        <p className="form-fields-text__error">{error}</p>
      </div>
    );
  }
}

export default TextInput;
