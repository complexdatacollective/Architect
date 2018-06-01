import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import uuid from 'uuid';

class Radio extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    input: PropTypes.object.isRequired,
  };

  static defaultProps = {
    className: '',
    label: null,
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
      ...rest
    } = this.props;

    const componentClasses = cx(
      'form-fields-radio',
      className,
      {
        'form-fields-radio--disabled': disabled,
      },
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
