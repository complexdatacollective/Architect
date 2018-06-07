import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import uuid from 'uuid';
import { Icon } from '../../../ui/components';

class TextInput extends PureComponent {
  static propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
    label: PropTypes.string,
    className: PropTypes.string,
    type: PropTypes.string,
    placeholder: PropTypes.string,
  };

  static defaultProps = {
    input: {},
    meta: {},
    type: 'text',
    label: null,
    placeholder: '',
    className: '',
  };

  componentWillMount() {
    this.id = uuid();
  }

  render() {
    const {
      input,
      meta: { error, active },
      label,
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
        { label &&
          <label htmlFor={this.id} className="form-fields-text__label">{label}</label>
        }
        <input
          id={this.id}
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
