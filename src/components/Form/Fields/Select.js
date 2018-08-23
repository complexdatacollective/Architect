import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

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

  constructor(props) {
    super(props);
    this.state = { visited: false };
  }

  // Redux Form's visited tracking seems wonky for Select elements. So we are tracking it manually.
  handleBlur = (e) => {
    this.setState({ visited: true });
    this.props.input.onBlur(e);
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
          <h4>{label}</h4>
        }
        <select className="form-fields-select__input" {...input} onBlur={this.handleBlur} {...rest}>
          {children}
          {options.map(
            (option) => {
              const { value, label: optionLabel, ...optionRest } = asOptionObject(option);
              return (<option value={value} key={value} {...optionRest}>{optionLabel}</option>);
            },
          )}
        </select>
        {this.state.visited && invalid && <p className="form-fields-select__error">{error}</p>}
      </div>
    );
  }
}

export default Select;
