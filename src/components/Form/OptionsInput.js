import React, { Component } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { has } from 'lodash';

class OptionsInput extends Component {
  static propTypes = {
    optionComponent: PropTypes.func.isRequired,
    options: PropTypes.array,
    className: PropTypes.string,
    input: PropTypes.object.isRequired,
  };

  static defaultProps = {
    options: [],
    className: null,
  };

  constructor(props) {
    super(props);

    this.state = { selected: null };
  }

  renderOption = (option) => {
    const {
      input: {
        value,
        onChange,
      },
      optionComponent: OptionComponent,
      ...rest
    } = this.props;

    if (!has(option, 'value')) {
      // eslint-disable-next-line
      option = { value: option, label: JSON.stringify(option) };
    }

    const selected = (value === option.value ? { selected: true } : {});

    return (
      <div
        className="options-input__option"
        onClick={() => { onChange(option.value); }}
        key={option.value}
      >
        <OptionComponent
          {...selected}
          {...rest}
          {...option}
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
