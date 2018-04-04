import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { fieldPropTypes } from 'redux-form';

class Radio extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    ...fieldPropTypes,
  };

  static defaultProps = {
    className: '',
  };

  render() {
    const {
      className,
      input,
      children,
      ...rest
    } = this.props;

    const componentClasses = cx(
      'form-fields-select',
      className,
    );

    return (
      <select className={componentClasses} {...input} {...rest}>
        {children}
      </select>
    );
  }
}

export default Radio;
