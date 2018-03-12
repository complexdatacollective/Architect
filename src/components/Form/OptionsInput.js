import React, { Component } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

class OptionsInput extends Component {
  static propTypes = {
    component: PropTypes.func.isRequired,
    options: PropTypes.array,
    className: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string,
  };

  static defaultProps = {
    options: [],
    className: null,
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
        onClick={() => { onChange(optionValue); }}
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
    const className = cx('options-input', this.props.className);

    return (
      <div className={className}>
        {this.renderOptions()}
      </div>
    );
  }
}

export default OptionsInput;
