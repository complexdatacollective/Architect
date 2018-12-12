import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Preview from './Preview';
import EditRule from './EditRule';

class Rules extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editingRuleId: null,
    };
  }

  handleCloseEditRule = () => {
    this.setState({ editingRuleId: null });
  }

  handleClickRule = (id) => {
    this.setState({ editingRuleId: id });
  }

  handleRuleChange = (newRuleValue) => {
    const updatedRules = this.props.rules.map(
      (rule) => {
        if (rule.id !== this.state.editingRuleId) { return rule; }
        return newRuleValue;
      },
    );

    this.props.onChange(updatedRules);
  }

  render() {
    const { rules, join, variableRegistry } = this.props;
    const { editingRuleId } = this.state;
    const rule = editingRuleId && rules.find(({ id }) => editingRuleId === id);

    return (
      <div>
        <Preview
          rules={rules}
          join={join}
          onClickRule={this.handleClickRule}
          variableRegistry={variableRegistry}
        />

        { editingRuleId &&
          <EditRule
            variableRegistry={variableRegistry}
            rule={rule}
            onChange={this.handleRuleChange}
            onClose={this.handleCloseEditRule}
          />
        }
      </div>
    );
  }
}

Rules.propTypes = {
  rules: PropTypes.array,
  join: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  variableRegistry: PropTypes.object.isRequired,
};

Rules.defaultProps = {
  rules: [],
  join: null,
};

export { Rules };

export default Rules;
