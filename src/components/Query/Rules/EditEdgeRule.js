import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import DetachedField from '@components/DetachedField';
import NativeSelect from '@components/Form/Fields/NativeSelect';
import withRuleChangeHandler from './withRuleChangeHandler';
import withOptions from './withOptions';
import Section from '../../EditorLayout/Section';
import EntitySelectField from '../../sections/fields/EntitySelectField/EntitySelectField';

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
    <>
      <Section
        title="Edge Type"
        summary={(
          <p>
            Choose an edge type to base your rule on. Remember you can add multiple rules if
            you need to cover different edge types.
          </p>
        )}
      >
        <DetachedField
          component={EntitySelectField}
          entityType="edge"
          name="type"
          options={typeOptions}
          onChange={handleRuleChange}
          value={optionsWithDefaults.type}
          validation={{ required: true }}
        />
      </Section>
      { optionsWithDefaults.type
        && (
        <Section
          title="Operator"
        >
          <DetachedField
            component={NativeSelect}
            name="operator"
            options={operatorOptions}
            onChange={handleRuleChange}
            value={optionsWithDefaults.operator}
            validation={{ required: true }}
          />
        </Section>
        )}
    </>
  );
};

EditEdgeRule.propTypes = {
  rule: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    options: PropTypes.object,
  }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  typeOptions: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  operatorOptions: PropTypes.array.isRequired,
  handleRuleChange: PropTypes.func.isRequired,
};

export default compose(
  withOptions('edge'),
  withRuleChangeHandler,
)(EditEdgeRule);
