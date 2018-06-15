import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import uuid from 'uuid';

class Checkbox extends PureComponent {
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
      'form-fields-checkbox',
      className,
      {
        'form-fields-checkbox--disabled': disabled,
      },
    );

    return (
      <label className={componentClasses} htmlFor={this.id}>
        <input
          type="checkbox"
          className="form-fields-checkbox__input"
          id={this.id}
          checked={!!input.value}
          {...input}
          {...rest}
        />
        <div className="form-fields-checkbox__checkbox" />
        <div className="form-fields-checkbox__label">
          {label || this.props.input.value}
        </div>
      </label>
    );
  }
}

export default Checkbox;
