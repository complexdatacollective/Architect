import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { fieldPropTypes } from 'redux-form';
import uuid from 'uuid';

class Radio extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
    className: PropTypes.string,
    ...fieldPropTypes,
  };

  static defaultProps = {
    className: '',
    label: null,
  };

  componentWillMount() {
    this.id = uuid();
  }

  render() {
    const {
      label,
      className,
      input,
      ...rest
    } = this.props;

    const componentClasses = cx(
      'form-fields-radio',
      className,
    );

    return (
      <label className={componentClasses} htmlFor={this.id}>
        <input
          type="radio"
          className="form-fields-radio__input"
          id={this.id}
          {...input}
          {...rest}
        />
        <div className="form-fields-radio__radio" />
        <div className="form-fields-radio__label">
          {label || this.props.input.value}
        </div>
      </label>
    );
  }
}

export default Radio;
