import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { toPairs, includes } from 'lodash';
import DropDown from './DropDown';
import Input from './Input';

const operators = toPairs({
  ANY: 'Any',
  NONE: 'None',
  EXACTLY: 'COUNT Exactly',
  NOT: 'COUNT Not',
  GREATER_THAN: 'COUNT Greater Than',
  GREATER_THAN_OR_EQUAL: 'COUNT Greater Than or Exactly',
  LESS_THAN: 'COUNT Less Than',
  LESS_THAN_OR_EQUAL: 'COUNT Less Than or Exactly',
});

class NetworkRule extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    logic: PropTypes.shape({
      operator: PropTypes.string,
      value: PropTypes.string,
    }),
  };

  static defaultProps = {
    logic: {
      operator: '',
      value: '',
    },
    onChange: () => {},
  };

  onUpdateRule = (value, option) => {
    this.props.onChange({
      ...this.props.logic,
      [option]: value,
    });
  };

  showValue() {
    return !!this.props.logic.operator &&
      !includes(['ANY', 'NONE'], this.props.logic.operator);
  }

  render() {
    const {
      logic: { operator, value },
    } = this.props;

    return (
      <div className="network-rule">
        <div className="rule rule--outer">
          <div className="rule__options">
            <div className="rule__option rule__option--operator">
              <DropDown
                options={operators}
                value={operator}
                placeholder="{rule}"
                onChange={newValue => this.onUpdateRule(newValue, 'operator')}
              />
            </div>
            {this.showValue() && (
              <div className="rule__option rule__option--value">
                <Input
                  type="number"
                  value={value}
                  onChange={newValue => this.onUpdateRule(newValue, 'value')}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default NetworkRule;
