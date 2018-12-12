import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import DetachedField from '../DetachedField';
import NodeSelect from '../Form/Fields/NodeSelect';
import Select from '../Form/Fields/Select';
import withRuleChangeHandler from './withRuleChangeHandler';
import withOptions from './withOptions';

const defaultOptions = {
  type: null,
  operator: null,
};

const EditEdgeRule = ({
  rule,
  typeOptions,
  operatorOptions,
  handleRuleChange,
}) => {
  const options = rule && rule.options;
  const optionsWithDefaults = { ...defaultOptions, ...options };

  return (
    <div>
      <div>
        <DetachedField
          component={NodeSelect}
          name="type"
          label="Type"
          options={typeOptions}
          onChange={handleRuleChange}
          value={optionsWithDefaults.type}
          validation={{}}
        />
      </div>
      <div>
        <DetachedField
          component={Select}
          name="operator"
          label="Operator"
          options={operatorOptions}
          onChange={handleRuleChange}
          value={optionsWithDefaults.operator}
          validation={{}}
        />
      </div>
    </div>
  );
};

EditEdgeRule.propTypes = {
  rule: PropTypes.shape({
    options: PropTypes.object,
  }).isRequired,
  typeOptions: PropTypes.array.isRequired,
  operatorOptions: PropTypes.array.isRequired,
  handleRuleChange: PropTypes.func.isRequired,
};

export { EditEdgeRule };

export default compose(
  withRuleChangeHandler,
  withOptions('edge'),
)(EditEdgeRule);
