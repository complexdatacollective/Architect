import React, { PureComponent } from 'react';
import ReactSelect, { components as ReactSelectComponents } from 'react-select';
import PropTypes from 'prop-types';
import cx from 'classnames';

const { Option } = ReactSelectComponents;

const DefaultSelectItem = props => (
  <Option
    {...props}
    className="form-fields-select__item"
    classNamePrefix="form-fields-select__item"
  >
    <p>{props.data.label}</p>
  </Option>
);

class Select extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    options: PropTypes.array,
    selectOptionComponent: PropTypes.any,
    input: PropTypes.object,
    label: PropTypes.string,
    children: PropTypes.node,
    meta: PropTypes.object,
  };

  static defaultProps = {
    className: '',
    selectOptionComponent: DefaultSelectItem,
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

  render() {
    const {
      className,
      input,
      children,
      options,
      selectOptionComponent,
      label,
      meta: { invalid, error },
      ...rest
    } = this.props;

    const componentClasses = cx(
      'form-fields-select',
      className,
    );

    const getValue = (opts, val) => {
      const foundValue = opts.find(o => o.value === val);
      if (!foundValue) {
        return null;
      }

      return opts.find(o => o.value === val);
    };

    return (
      <div className={componentClasses}>
        { label &&
          <h4>{label}</h4>
        }
        <ReactSelect
          className="form-fields-select"
          classNamePrefix="form-fields-select"
          {...input}
          options={options}
          value={getValue(this.props.options, this.props.input.value)}
          components={{ Option: selectOptionComponent }}
          styles={{ menuPortal: base => ({ ...base, zIndex: 30 }) }}
          menuPortalTarget={document.body}
          onChange={(e) => {
            this.props.input.onChange(e.value);
          }}
          onBlur={() => {
            if (input.onBlur) {
              input.onBlur(input.value);
            }
          }}
          blurInputOnSelect={false}
          {...rest}
        >
          {children}
        </ReactSelect>
        {this.state.visited && invalid && <p className="form-fields-select__error">{error}</p>}
      </div>
    );
  }
}

export default Select;
