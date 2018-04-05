import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { fieldPropTypes } from 'redux-form';

class Radio extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    options: PropTypes.array,
    ...fieldPropTypes,
  };

  static defaultProps = {
    className: '',
    options: [],
  };

  render() {
    const {
      className,
      input,
      children,
      options,
      ...rest
    } = this.props;

    const componentClasses = cx(
      'form-fields-select',
      className,
    );

    return (
      <select className={componentClasses} {...input} {...rest}>
        {children}
        {options.map(option => <option value={option}>{option}</option>)}
      </select>
    );
  }
}

export default Radio;
