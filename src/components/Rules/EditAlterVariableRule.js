import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { operatorsWithValue } from './options';
import DetachedField from '../DetachedField';
import NodeSelect from '../Form/Fields/NodeSelect';
import Select from '../Form/Fields/Select';
import EditValue from './EditValue';
import withRuleChangeHandler from './withRuleChangeHandler';
import withOptions from './withOptions';

const defaultOptions = {
  type: null,
  variable: null,
  operator: null,
  value: '',
};

const EditAlterVariableRule = ({
  rule,
  typeOptions,
  variableType,
  variableOptions,
  operatorOptions,
  handleRuleChange,
}) => {
  const options = rule && rule.options;
  const optionsWithDefaults = { ...defaultOptions, ...options };
  const operatorNeedsValue = operatorsWithValue.has(optionsWithDefaults.operator);

  return (
    <div className="rules-edit-rule__fields">
      <div className="rules-edit-rule__row">
        <DetachedField
          component={NodeSelect}
          name="type"
          label="Type"
          options={typeOptions}
          onChange={handleRuleChange}
          value={optionsWithDefaults.type}
          validation={{ required: true }}
        />
      </div>
      <div className="rules-edit-rule__row">
        <DetachedField
          component={Select}
          name="variable"
          label="Variable"
          options={variableOptions}
          onChange={handleRuleChange}
          value={optionsWithDefaults.variable}
          validation={{ required: true }}
        />
      </div>
      <div className="rules-edit-rule__row">
        <DetachedField
          component={Select}
          name="operator"
          label="Operator"
          options={operatorOptions}
          onChange={handleRuleChange}
          value={optionsWithDefaults.operator}
          validation={{ required: true }}
        />
      </div>
      { operatorNeedsValue &&
        <div className="rules-edit-rule__row">
          <EditValue
            variableType={variableType}
            onChange={handleRuleChange}
            value={optionsWithDefaults.value}
            validation={{ required: true }}
          />
        </div>
      }
    </div>
  );
};

EditAlterVariableRule.propTypes = {
  rule: PropTypes.shape({
    options: PropTypes.object,
  }).isRequired,
  typeOptions: PropTypes.array.isRequired,
  variableOptions: PropTypes.array.isRequired,
  operatorOptions: PropTypes.array.isRequired,
  handleRuleChange: PropTypes.func.isRequired,
  variableType: PropTypes.string.isRequired,
};

export { EditAlterVariableRule };

export default compose(
  withRuleChangeHandler,
  withOptions('node'),
)(EditAlterVariableRule);
