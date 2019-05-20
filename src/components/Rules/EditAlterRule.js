import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { operatorsWithValue } from './options';
import DetachedField from '../DetachedField';
import NodeSelect from '../Form/Fields/NodeSelect';
import Select from '../Form/Fields/Select';
import RadioGroup from '../../ui/components/Fields/RadioGroup';
import EditValue from './EditValue';
import withRuleChangeHandler from './withRuleChangeHandler';
import withOptions from './withOptions';
import {
  withAlterRuleType,
  alterRuleTypes,
  alterRuleTypeOptions,
} from './withAlterRuleType';

const defaultOptions = {
  type: null,
  attribute: null,
  operator: null,
  value: '',
};

const EditAlterRule = ({
  alterRuleType,
  handleChangeAlterRuleType,
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
  const isVariableRule = alterRuleType === alterRuleTypes.VARIABLE_ALTER;
  const isTypeRule = alterRuleType === alterRuleTypes.TYPE_ALTER;

  return (
    <div className="rules-edit-rule__fields">
      <h1>Edit Rule</h1>
      <div className="rules-edit-rule__row">
        <h4>Choose Node Type</h4>
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
      { optionsWithDefaults.type &&
        <div className="rules-edit-rule__row">
          <DetachedField
            component={RadioGroup}
            options={alterRuleTypeOptions}
            value={alterRuleType}
            onChange={handleChangeAlterRuleType}
          />
        </div>
      }
      { isTypeRule && optionsWithDefaults.type &&
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
      }
      { isVariableRule && optionsWithDefaults.type &&
        <div className="rules-edit-rule__row">
          <DetachedField
            component={Select}
            name="attribute"
            label="Variable"
            options={variableOptions}
            onChange={handleRuleChange}
            value={optionsWithDefaults.attribute}
            validation={{ required: true }}
          />
        </div>
      }
      { isVariableRule && optionsWithDefaults.attribute &&
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
      }
      { isVariableRule && operatorNeedsValue &&
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

EditAlterRule.propTypes = {
  rule: PropTypes.shape({
    options: PropTypes.object,
  }).isRequired,
  typeOptions: PropTypes.array.isRequired,
  variableOptions: PropTypes.array.isRequired,
  operatorOptions: PropTypes.array.isRequired,
  handleRuleChange: PropTypes.func.isRequired,
  variableType: PropTypes.string.isRequired,
  alterRuleType: PropTypes.string.isRequired,
  handleChangeAlterRuleType: PropTypes.func.isRequired,
};

export { EditAlterRule };

export default compose(
  withAlterRuleType,
  withRuleChangeHandler,
  withOptions('node'),
)(EditAlterRule);
