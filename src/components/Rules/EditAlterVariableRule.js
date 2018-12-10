import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import DetachedField from '../DetachedField';
import NodeSelect from '../Form/Fields/NodeSelect';
import Select from '../Form/Fields/Select';
import Text from '../../ui/components/Fields/Text';
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
  variableOptions,
  operatorOptions,
  handleRuleChange,
}) => {

  const options = rule && rule.options;
  const optionsWithDefaults = { ...defaultOptions, ...options };

  console.log('rendered', { options, defaultOptions, optionsWithDefaults });

  return (
    <div>
      <div>
        <DetachedField
          component={NodeSelect}
          name="type"
          label="Type"
          options={typeOptions()}
          onChange={handleRuleChange}
          value={optionsWithDefaults.type}
          validation={{}}
        />
      </div>
      <div>
        <DetachedField
          component={Select}
          name="variable"
          label="Variable"
          options={variableOptions()}
          onChange={handleRuleChange}
          value={optionsWithDefaults.variable}
          validation={{}}
        />
      </div>
      <div>
        <DetachedField
          component={Select}
          name="operator"
          label="Operator"
          options={operatorOptions()}
          onChange={handleRuleChange}
          value={optionsWithDefaults.operator}
          validation={{}}
        />
      </div>
      <div>
        <DetachedField
          component={Text}
          label="Value"
          name="value"
          onChange={handleRuleChange}
          value={optionsWithDefaults.value}
          validation={{}}
        />
      </div>
    </div>
  );
};

EditAlterVariableRule.propTypes = {
  rule: PropTypes.shape({
    options: PropTypes.object,
  }).isRequired,
  typeOptions: PropTypes.func.isRequired,
  variableOptions: PropTypes.func.isRequired,
  operatorOptions: PropTypes.func.isRequired,
  handleRuleChange: PropTypes.func.isRequired,
};

export { EditAlterVariableRule };

export default compose(
  withRuleChangeHandler,
  withOptions('node'),
)(EditAlterVariableRule);
