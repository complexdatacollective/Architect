import React from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';
import { compose } from 'recompose';
import DetachedField from '@components/DetachedField';
import NodeSelect from '@components/Form/Fields/NodeSelect';
import NativeSelect from '@components/Form/Fields/NativeSelect';
import ExternalLink from '@components/ExternalLink';
import RadioGroup from '@codaco/ui/lib/components/Fields/RadioGroup';
import EditValue from './EditValue';
import { operatorsWithValue } from './options';
import withRuleChangeHandler from './withRuleChangeHandler';
import withOptions from './withOptions';
import {
  withAlterRuleType,
  alterRuleTypes,
  alterRuleTypeOptions,
} from './withAlterRuleType';
import { makeGetOptionsWithDefaults } from './defaultRule';

const EditAlterRule = ({
  alterRuleType,
  handleChangeAlterRuleType,
  rule,
  typeOptions,
  variableType,
  variablesAsOptions,
  variableOptions,
  operatorOptions,
  handleRuleChange,
}) => {
  const options = rule && rule.options;
  const getOptionsWithDefaults = makeGetOptionsWithDefaults(
    variableType,
    ['type', 'operator', 'attributes', 'value'],
  );
  const optionsWithDefaults = getOptionsWithDefaults(options);
  const operatorNeedsValue = operatorsWithValue.has(optionsWithDefaults.operator);
  const isVariableRule = alterRuleType === alterRuleTypes.VARIABLE_ALTER;
  const isTypeRule = alterRuleType === alterRuleTypes.TYPE_ALTER;

  const rowVariants = {
    show: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring' },
    },
    hide: {
      opacity: 0,
      x: -50,
    },
  };

  return (
    <AnimatePresence exitBeforeEnter initial={false}>
      <motion.div className="rules-edit-rule__fields">
        <h1>Construct an Alter Rule</h1>
        <p>
          For help with constructing rules, see our documentation articles
          on <ExternalLink href="https://documentation.networkcanvas.com/docs/key-concepts/skip-logic/">skip logic</ExternalLink> and <ExternalLink href="https://documentation.networkcanvas.com/docs/key-concepts/filtering/">network filtering</ExternalLink>.
        </p>
        <motion.div
          className="rules-edit-rule__row"
          variants={rowVariants}
          exit="hide"
          animate="show"
          initial="hide"
          layout
          key="step1"
        >
          <h4>Step 1: Select an alter type</h4>
          <p>
            Choose an alter type to base your rule on. Remember you can add multiple rules if
            you need to cover different alter types.
          </p>
          <DetachedField
            component={NodeSelect}
            name="type"
            options={typeOptions}
            onChange={handleRuleChange}
            value={optionsWithDefaults.type}
            validation={{ required: true }}
          />
        </motion.div>
        { optionsWithDefaults.type &&
          <motion.div
            className="rules-edit-rule__row"
            variants={rowVariants}
            exit="hide"
            animate="show"
            initial="hide"
            layout
            key="step2"
          >
            <DetachedField
              component={RadioGroup}
              options={alterRuleTypeOptions}
              label="Step 2: Choose a rule type"
              value={alterRuleType}
              onChange={handleChangeAlterRuleType}
            />
          </motion.div>
        }
        { isTypeRule && optionsWithDefaults.type &&
          <motion.div
            className="rules-edit-rule__row"
            variants={rowVariants}
            exit="hide"
            animate="show"
            initial="hide"
            layout
            key="step3a"
          >
            <DetachedField
              component={RadioGroup}
              name="operator"
              label="Step 3: Choose an operator"
              options={operatorOptions}
              onChange={handleRuleChange}
              value={optionsWithDefaults.operator}
              validation={{ required: true }}
            />
          </motion.div>
        }
        { isVariableRule && optionsWithDefaults.type &&
          <motion.div
            className="rules-edit-rule__row"
            variants={rowVariants}
            exit="hide"
            animate="show"
            initial="hide"
            layout
            key="step3b"
          >
            <DetachedField
              component={NativeSelect}
              name="attribute"
              label="Step 3: Select a variable to query"
              options={variablesAsOptions}
              onChange={handleRuleChange}
              value={optionsWithDefaults.attribute}
              validation={{ required: true }}
            />
          </motion.div>
        }
        { isVariableRule && optionsWithDefaults.attribute &&
          <motion.div
            className="rules-edit-rule__row"
            variants={rowVariants}
            exit="hide"
            animate="show"
            initial="hide"
            layout
            key="step4"
          >
            <DetachedField
              component={NativeSelect}
              name="operator"
              label="Step 4: Choose an operator"
              options={operatorOptions}
              onChange={handleRuleChange}
              value={optionsWithDefaults.operator}
              validation={{ required: true }}
            />
          </motion.div>
        }
        { isVariableRule && operatorNeedsValue &&
          <motion.div
            className="rules-edit-rule__row"
            variants={rowVariants}
            exit="hide"
            animate="show"
            initial="hide"
            layout
            key="step5"
          >
            <h4>Step 5: Select an attribute value</h4>
            <EditValue
              variableType={variableType}
              placeholder="Enter a value..."
              onChange={handleRuleChange}
              value={optionsWithDefaults.value}
              options={variableOptions}
              validation={{ required: true }}
            />
          </motion.div>
        }
      </motion.div>
    </AnimatePresence>
  );
};

EditAlterRule.propTypes = {
  rule: PropTypes.shape({
    options: PropTypes.object,
  }).isRequired,
  typeOptions: PropTypes.array.isRequired,
  variablesAsOptions: PropTypes.array.isRequired,
  variableOptions: PropTypes.array,
  operatorOptions: PropTypes.array.isRequired,
  handleRuleChange: PropTypes.func.isRequired,
  alterRuleType: PropTypes.string,
  variableType: PropTypes.string,
  handleChangeAlterRuleType: PropTypes.func.isRequired,
};

EditAlterRule.defaultProps = {
  variableOptions: null,
  alterRuleType: null,
  variableType: null,
};

export { EditAlterRule };

export default compose(
  withAlterRuleType,
  withRuleChangeHandler,
  withOptions('node'),
)(EditAlterRule);
