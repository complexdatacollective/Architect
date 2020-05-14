import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import DetachedField from '@components/DetachedField';
import Select from '@components/Form/Fields/Select';
import { operatorsWithValue } from './options';
import EditValue from './EditValue';
import withRuleChangeHandler from './withRuleChangeHandler';
import withOptions from './withOptions';

const defaultOptions = {
  type: null,
  attribute: null,
  operator: null,
  value: '',
};

const EditEgoRule = ({
  rule,
  variableType,
  variablesAsOptions,
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
          component={Select}
          name="attribute"
          label="Variable"
          options={variablesAsOptions}
          onChange={handleRuleChange}
          value={optionsWithDefaults.attribute}
          validation={{ required: true }}
        />
      </div>
      { optionsWithDefaults.attribute &&
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
      { operatorNeedsValue &&
        <div className="rules-edit-rule__row">
          <EditValue
            variableType={variableType}
            onChange={handleRuleChange}
            value={optionsWithDefaults.value}
            options={variableOptions}
            validation={{ required: true }}
          />
        </div>
      }
    </div>
  );
};

EditEgoRule.propTypes = {
  rule: PropTypes.shape({
    options: PropTypes.object,
  }).isRequired,
  variablesAsOptions: PropTypes.array.isRequired,
  variableOptions: PropTypes.array,
  operatorOptions: PropTypes.array.isRequired,
  handleRuleChange: PropTypes.func.isRequired,
  variableType: PropTypes.string,
};

EditEgoRule.defaultProps = {
  variableType: null,
  variableOptions: null,
};

export { EditEgoRule };

export default compose(
  withOptions('ego'),
  withRuleChangeHandler,
)(EditEgoRule);
