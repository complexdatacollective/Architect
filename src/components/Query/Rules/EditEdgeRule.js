import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import DetachedField from '@components/DetachedField';
import EdgeSelect from '@components/Form/Fields/EdgeSelect';
import Select from '@components/Form/Fields/Select';
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
    <div className="rules-edit-rule__fields">
      <div className="rules-edit-rule__row">
        <DetachedField
          component={EdgeSelect}
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
  withOptions('edge'),
  withRuleChangeHandler,
)(EditEdgeRule);
