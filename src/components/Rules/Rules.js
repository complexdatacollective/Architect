import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import Preview from './Preview';
import EditRule from './EditRule';

const generateRule = (id, type, options = {}) => ({
  id,
  type,
  options: { type: undefined, operator: undefined, ...options },
});

class Rules extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editingRuleId: null,
    };
  }

  editRule(editingRuleId = null) {
    this.setState({ editingRuleId });
  }

  handleCloseEditRule = () => {
    this.editRule();
  }

  handleClickRule = (id) => {
    this.editRule(id);
  }

  handleAddAlterTypeRule = () => {
    const id = uuid();
    this.props.onChange([...this.props.rules, generateRule(id, 'alter')]);
    this.editRule(id);
  };

  handleAddAlterVariableRule = () => {
    const id = uuid();
    this.props.onChange([
      ...this.props.rules,
      generateRule(id, 'alter', { variable: undefined, value: undefined }),
    ]);
    this.editRule(id);
  };

  handleAddEdgeRule = () => {
    const id = uuid();
    this.props.onChange([...this.props.rules, generateRule(id, 'edge')]);
    this.editRule(id);
  };

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

        <button type="button" onClick={this.handleAddAlterTypeRule}>Add alter type rule</button>
        <button type="button" onClick={this.handleAddAlterVariableRule}>Add alter variable rule</button>
        <button type="button" onClick={this.handleAddEdgeRule}>Add edge rule</button>
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
