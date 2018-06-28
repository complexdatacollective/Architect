import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import uuid from 'uuid';

const asOptionObject = (option) => {
  if (typeof option !== 'string') { return option; }
  return {
    value: option,
    label: option,
  };
};

class Select extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    options: PropTypes.array,
    input: PropTypes.object,
    label: PropTypes.string,
    children: PropTypes.node,
    meta: PropTypes.object,
  };

  static defaultProps = {
    className: '',
    options: [],
    input: {},
    label: null,
    children: null,
    meta: { invalid: false, error: null, touched: false },
  };

  componentWillMount() {
    this.id = uuid();
  }

  render() {
    const {
      className,
      input,
      children,
      options,
      label,
      meta: { invalid, error },
      ...rest
    } = this.props;

    const componentClasses = cx(
      'form-fields-select',
      className,
    );

    return (
      <div className={componentClasses}>
        { label &&
          <label
            htmlFor={this.id}
            className="form-fields-select__label"
          >{label}</label>
        }
        <select className="form-fields-select__input" {...input} {...rest}>
          {children}
          {options.map(
            (option) => {
              const { value, label: optionLabel, ...optionRest } = asOptionObject(option);
              return (<option value={value} key={value} {...optionRest}>{optionLabel}</option>);
            },
          )}
        </select>
        {invalid && <p className="form-fields-select__error">{error}</p>}
      </div>
    );
  }
}

export default Select;
