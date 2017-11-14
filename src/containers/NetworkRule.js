import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import NetworkRule from '../components/NetworkRule';

const defaultLogic = {
  operator: '',
  value: '',
};

export default class extends PureComponent {
  static propTypes = {
    logic: PropTypes.object,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    onChange: () => {},
    logic: defaultLogic,
  }

  onUpdateRule = (event, option) => {
    const value = event.target.value;

    this.props.onChange({
      ...this.props.logic,
      [option]: value,
    });
  };

  render() {
    return (
      <div className="network-rule">
        <NetworkRule
          options={{ ...this.props.logic }}
          onUpdateRule={this.onUpdateRule}
        />
      </div>
    );
  }
}
