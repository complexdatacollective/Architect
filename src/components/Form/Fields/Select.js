import React, { PureComponent } from 'react';
import ReactSelect, { components } from 'react-select';
import PropTypes from 'prop-types';
import cx from 'classnames';

const getValue = (opts, val) => opts.find(o => o.value === val);

const { Option } = components;

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
    selectComponent: PropTypes.any,
    input: PropTypes.object,
    label: PropTypes.string,
    children: PropTypes.node,
    meta: PropTypes.object,
  };

  static defaultProps = {
    className: '',
    selectComponent: DefaultSelectItem,
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

    if (this.props.input.onBlur) {
      this.props.input.onBlur(e);
    }
  }

  render() {
    const {
      className,
      input,
      children,
      options,
      selectComponent,
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
        <ReactSelect
          className="form-fields-select"
          classNamePrefix="form-fields-select"
          {...input}
          options={options}
          value={getValue(this.props.options, this.props.input.value)}
          components={{ Option: selectComponent }}
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
