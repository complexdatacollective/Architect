import React from 'react';
import PropTypes from 'prop-types';
import PreviewRule from './PreviewRule';

const Preview = ({ join, rules, variableRegistry, onClickRule }) => (
  <div>
    {rules.map(
      (rule, index) => (
        <PreviewRule
          {...rule}
          join={index !== rules.length - 1 && join}
          variableRegistry={variableRegistry}
          onClick={() => onClickRule(rule.id)}
        />
      ),
    )}
  </div>
);

Preview.propTypes = {
  join: PropTypes.string.isRequired,
  rules: PropTypes.array.isRequired,
  onClickRule: PropTypes.func.isRequired,
};

export { Preview };

export default Preview;
