import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import uuid from 'uuid';

class Radio extends PureComponent {
  static propTypes = {
    label: PropTypes.node,
    fieldLabel: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    input: PropTypes.object.isRequired,
  };

  static defaultProps = {
    className: '',
    label: null,
    fieldLabel: null,
    disabled: false,
  };

  componentWillMount() {
    this.id = uuid();
  }

  render() {
    const {
      label,
      className,
      input,
      disabled,
      fieldLabel,
      ...rest
    } = this.props;

    const componentClasses = cx(
      'form-field-radio',
      className,
      {
        'form-field-radio--disabled': disabled,
      },
    );

    return (
      <label className={componentClasses} htmlFor={this.id}>
        <input
          type="radio"
          className="form-field-radio__input"
          id={this.id}
          // input.checked is only provided by redux form if type="checkbox" or type="radio" is
          // provided to <Field />, so for the case that it isn't we can rely on the more reliable
          // input.value
          checked={!!input.value}
          {...input}
          {...rest}
        />
        <div className="form-field-radio__radio" />
        {label}
      </label>
    );
  }
}

export default Radio;
