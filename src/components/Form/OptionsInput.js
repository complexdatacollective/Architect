import React, { Component } from 'react';
import PropTypes from 'prop-types';

class OptionsInput extends Component {
  static propTypes = {
    component: PropTypes.func.isRequired,
    options: PropTypes.array,
    onChange: PropTypes.func,
    value: PropTypes.string,
  };

  static defaultProps = {
    options: [],
    onChange: () => {},
    value: null,
  };

  constructor(props) {
    super(props);

    this.state = { selected: null };
  }

  renderOption = (optionValue) => {
    const {
      value,
      onChange,
      component: OptionComponent,
    } = this.props;

    const selected = value === optionValue ? { selected: true } : {};

    return (
      <div
        className="options-input__option"
        onClick={() => { console.log(optionValue, 'option'); onChange(optionValue); }}
        key={optionValue}
      >
        <OptionComponent
          value={optionValue}
          {...selected}
        />
      </div>
    );
  };

  renderOptions() {
    return this.props.options.map(this.renderOption);
  }

  render() {
    return (
      <div className="options-input">
        {this.renderOptions()}
      </div>
    );
  }
}

export default OptionsInput;
