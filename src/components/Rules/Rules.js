import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import PreviewRules from './PreviewRules';
import EditRule from './EditRule';
import Button from '../../ui/components/Button';
import RadioGroup from '../../ui/components/Fields/RadioGroup';
import DetachedField from '../DetachedField';

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
    this.props.onChange({
      rules: updatedRules,
    });
  };

  handleChangeJoin = (newValue) => {
    this.props.onChange({
      join: newValue,
    });
  }

  handleDeleteRule = (ruleId) => {
    const updateRules = this.props.rules.filter(rule => rule.id !== ruleId);

    this.props.confirmAction({
      type: 'Warning',
      title: 'Are you sure you want to delete this rule?',
      onConfirm: () => {
        this.props.onChange({
          rules: updateRules,
        });
      },
    })


  }

  render() {
    const { rules, join, variableRegistry } = this.props;
    const { editRule } = this.state;

    return (
      <div className="rules-rules">
        <div className="rules-rules__join">
          Must match:
          <DetachedField
            component={RadioGroup}
            options={[
              { label: 'All', value: 'AND' },
              { label: 'Any', value: 'OR' },
            ]}
            value={join}
            onChange={this.handleChangeJoin}
          />
        </div>

        <EditRule
          variableRegistry={variableRegistry}
          rule={editRule}
          onChange={this.handleRuleChange}
          onSave={this.handleSaveRule}
        />

        <div className="rules-rules__preview">
          <PreviewRules
            rules={rules}
            join={join}
            onClickRule={this.handleClickRule}
            onDeleteRule={this.handleDeleteRule}
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
