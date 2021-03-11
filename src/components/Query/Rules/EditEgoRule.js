import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { motion, AnimatePresence } from 'framer-motion';
import ExternalLink from '@components/ExternalLink';
import DetachedField from '@components/DetachedField';
import NativeSelect from '@components/Form/Fields/NativeSelect';
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
        <h1>Construct an Ego Rule</h1>
        <p>
          For help with constructing rules, see our documentation articles
          on
          {' '}
          <ExternalLink href="https://documentation.networkcanvas.com/docs/key-concepts/skip-logic/">skip logic</ExternalLink>
          {' '}
          and
          {' '}
          <ExternalLink href="https://documentation.networkcanvas.com/docs/key-concepts/filtering/">network filtering</ExternalLink>
          .
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
          <DetachedField
            component={NativeSelect}
            name="attribute"
            label="Step 1: Select a variable to query"
            options={variablesAsOptions}
            onChange={handleRuleChange}
            value={optionsWithDefaults.attribute}
            validation={{ required: true }}
          />
        </motion.div>
        { optionsWithDefaults.attribute
          && (
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
              component={NativeSelect}
              name="operator"
              label="Step 2: Choose an operator"
              options={operatorOptions}
              onChange={handleRuleChange}
              value={optionsWithDefaults.operator}
              validation={{ required: true }}
            />
          </motion.div>
          )}
        { operatorNeedsValue
          && (
          <motion.div
            className="rules-edit-rule__row"
            variants={rowVariants}
            exit="hide"
            animate="show"
            initial="hide"
            layout
            key="step3"
          >
            <h4>Step 3: Select an attribute value</h4>
            <EditValue
              variableType={variableType}
              placeholder="Enter a value..."
              onChange={handleRuleChange}
              value={optionsWithDefaults.value}
              options={variableOptions}
              validation={{ required: true }}
            />
          </motion.div>
          )}
      </motion.div>
    </AnimatePresence>
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
