import React, { PureComponent } from 'react';
import ReactSelect from 'react-select';
import PropTypes from 'prop-types';
import cx from 'classnames';
import SelectImageItem from './SelectImageItem';

const getValue = (opts, val) => opts.find(o => o.value === val);

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
      label,
      meta: { invalid, error },
      ...rest
    } = this.props;

    const componentClasses = cx(
      'form-fields-select',
      className,
    );

    console.log(options);

    return (
      <div className={componentClasses}>
        { label &&
          <h4>{label}</h4>
        }
        <ReactSelect
          className="form-fields-select__input"
          {...input}
          options={options}
          value={getValue(this.props.options, this.props.input.value)}
          components={{ Option: SelectImageItem }}
          styles={{ menuPortal: base => ({ ...base, zIndex: 9999, width: 450 }) }}
          menuPortalTarget={document.body}
          onChange={(e) => {
            console.log('onChange', e.value);
            this.props.input.onChange(e.value);
            console.log(this);
          }}
          onBlur={() => input.onBlur(input.value)}
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
