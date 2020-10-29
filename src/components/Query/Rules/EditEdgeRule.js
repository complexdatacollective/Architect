import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { compose } from 'recompose';
import DetachedField from '@components/DetachedField';
import ExternalLink from '@components/ExternalLink';
import EdgeSelect from '@components/Form/Fields/EdgeSelect';
import NativeSelect from '@components/Form/Fields/NativeSelect';
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
        <h1>Construct an Edge Rule</h1>
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
          <h4>Step 1: Select an edge type</h4>
          <p>
            Choose an edge type to base your rule on. Remember you can add multiple rules if
            you need to cover different edge types.
          </p>
          <DetachedField
            component={EdgeSelect}
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
              component={NativeSelect}
              name="operator"
              label="Step 2: Choose an operator"
              options={operatorOptions}
              onChange={handleRuleChange}
              value={optionsWithDefaults.operator}
              validation={{ required: true }}
            />
          </motion.div>
        }
      </motion.div>
    </AnimatePresence>
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
