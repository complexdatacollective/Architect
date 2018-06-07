import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Checkbox from './Checkbox';

class CheckboxList extends PureComponent {
  static propTypes = {
    options: PropTypes.array,
    input: PropTypes.object.isRequired,
  };

  static defaultProps = {
    className: '',
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
      input={{
        value: option,
        checked: this.isOptionChecked(option),
        onChange: this.handleClickOption,
      }}
    />
  );

  render() {
    const { options } = this.props;

    return (
      <React.Fragment>
        {options.map(this.renderOption)}
      </React.Fragment>
    );
  }
}

export default CheckboxList;
