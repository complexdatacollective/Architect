import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import Preview from './Preview';
import EditRule from './EditRule';
import Button from '../../ui/components/Button';

const generateRule = (type, options = {}) => ({
  type,
  options: { type: undefined, operator: undefined, ...options },
});

class Rules extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editRule: null,
    };
  }

  updateRuleState(editRule = null) {
    this.setState({ editRule });
  }

  closeEditRule() {
    this.setState({ editRule: null });
  }

  handleCloseEditRule = () => {
    this.closeEditRule();
  }

  handleClickRule = (ruleId) => {
    const rule = this.props.rules.find(({ id }) => id === ruleId);
    this.updateRuleState(rule);
  }

  handleAddAlterTypeRule = () => {
    this.updateRuleState(generateRule('alter'));
  };

  handleAddAlterVariableRule = () => {
    this.updateRuleState(generateRule('alter', { variable: undefined, value: undefined }));
  };

  handleAddEdgeRule = () => {
    this.updateRuleState(generateRule('edge'));
  };

  handleRuleChange = (newRuleValue) => {
    this.updateRuleState(newRuleValue);
  }

  handleSaveRule = () => {
    let updatedRules = [];

    if (!this.state.editRule.id) {
      updatedRules = [
        ...this.props.rules,
        { ...this.state.editRule, id: uuid() },
      ];
    } else {
      updatedRules = this.props.rules.map(
        (rule) => {
          if (rule.id === this.state.editRule.id) { return this.state.editRule; }
          return rule;
        },
      );
    }

    this.closeEditRule();
    this.props.onChange(updatedRules);
  };

  render() {
    const { rules, join, variableRegistry } = this.props;
    const { editRule } = this.state;

    return (
      <div className="rules-rules">
        <EditRule
          variableRegistry={variableRegistry}
          rule={editRule}
          onChange={this.handleRuleChange}
          onSave={this.handleSaveRule}
        />

        <div className="rules-rules__preview">
          <Preview
            rules={rules}
            join={join}
            onClickRule={this.handleClickRule}
            variableRegistry={variableRegistry}
          />
        </div>

        <div className="rules-rules__add-new">
          <Button
            type="button"
            size="small"
            onClick={this.handleAddAlterTypeRule}
          >Add alter type rule</Button>
          <Button
            type="button"
            size="small"
            onClick={this.handleAddAlterVariableRule}
          >Add alter variable rule</Button>
          <Button
            type="button"
            size="small"
            onClick={this.handleAddEdgeRule}
          >Add edge rule</Button>
        </div>
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
