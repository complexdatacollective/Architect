import React from 'react';
import PropTypes from 'prop-types';
import PreviewRule from './PreviewRule';

const Preview = ({ join, rules, variableRegistry, onClickRule }) => (
  <div className="rules-preview">
    <div className="rules-preview__rules">
      {rules.map(
        (rule, index) => (
          <div className="rules-preview__rule">
            <PreviewRule
              {...rule}
              join={index !== rules.length - 1 && join}
              variableRegistry={variableRegistry}
              onClick={() => onClickRule(rule.id)}
            />
          </div>
        ),
      )}
    </div>
  </div>
);

Preview.propTypes = {
  join: PropTypes.string.isRequired,
  rules: PropTypes.array.isRequired,
  variableRegistry: PropTypes.object.isRequired,
  onClickRule: PropTypes.func.isRequired,
};

export { Preview };

export default Preview;
