import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { uniqueId } from 'lodash';
import cx from 'classnames';

class Select extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    label: PropTypes.string,
    value: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.any,
  };

  static defaultProps = {
    label: '',
    value: '',
    onChange: () => {},
    className: '',
    children: null,
  };

  componentWillMount() {
    this.id = uniqueId('label');
  }

  render() {
    const {
      value,
      label,
      onChange,
      className,
      children,
      ...props
    } = this.props;

    return (
      <label htmlFor={this.id} className={cx('select')}>
        <div className={cx('select__label', className)}>
          {label}
        </div>
        <select
          className="select__value"
          onChange={event => onChange(event.target.value)}
          value={value}
          id={this.id}
          ref={(input) => { this.input = input; }}
          {...props}
        >
          {children}
        </select>
      </label>
    );
  }
}

export default Select;
