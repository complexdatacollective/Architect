import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

class Mode extends PureComponent {
  static propTypes = {
    options: PropTypes.array,
    label: PropTypes.string,
    className: PropTypes.string,
    input: PropTypes.object.isRequired,
  };

  static defaultProps = {
    className: null,
    label: null,
    options: [],
    disabled: false,
  };

  get value() {
    return this.props.input.value;
  }

  handleClickMode = (option) => {
    this.props.input.onChange(option);
  }

  isModeSelected = option =>
    this.props.input.value === option;

  renderMode = (option) => {
    const [value, label] = option.length ? option : [option, option.toString()];
    const optionClasses = cx(
      'form-fields-mode__option',
      { 'form-fields-mode__option--selected': this.isModeSelected(value) },
    );

    return (
      <div
        className={optionClasses}
        onClick={() => this.handleClickMode(value)}
        key={value}
      >
        {label}
      </div>
    );
  }

  render() {
    const {
      options,
      className,
      label,
    } = this.props;

    const classNames = cx(
      'form-fields-mode',
      className,
    );

    return (
      <div className={classNames}>
        { label &&
          <div className="form-fields-mode__label">{label}</div>
        }
        <div>
          <div className="form-fields-mode__options">
            { options.map(this.renderMode) }
          </div>
        </div>
      </div>
    );
  }
}

export default Mode;
