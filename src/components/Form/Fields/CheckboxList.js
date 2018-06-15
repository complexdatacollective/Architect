import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Checkbox from './Checkbox';

class CheckboxList extends PureComponent {
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

  handleClickOption = (event) => {
    const option = event.target.value;
    const newValue = this.isOptionChecked(option) ?
      this.value.filter(value => value !== option) :
      [...this.value, option];
    this.props.input.onChange(newValue);
  }

  isOptionChecked = (option) => {
    const value = this.props.input.value || [];
    return value.includes(option);
  }

  renderOption = option => (
    <Checkbox
      className="form-fields-checkbox-list__option"
      key={option}
      input={{
        value: option,
        checked: this.isOptionChecked(option),
        onChange: this.handleClickOption,
      }}
    />
  );

  render() {
    const {
      options,
      className,
      label,
    } = this.props;

    const classNames = cx(
      'form-fields-checkbox-list',
      className,
    );

    return (
      <div className={classNames}>
        { label &&
          <div className="form-fields-checkbox-list__label">{label}</div>
        }
        { options.map(this.renderOption) }
      </div>
    );
  }
}

export default CheckboxList;
