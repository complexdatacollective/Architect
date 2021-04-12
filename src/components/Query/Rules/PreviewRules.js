import React from 'react';
import PropTypes from 'prop-types';
import PreviewRule from './PreviewRule';

const PreviewRules = ({
  join, rules, codebook, onClickRule, onDeleteRule,
}) => {
  const getJoin = (index) => (rules.length !== 1 && index < rules.length - 1 ? join : null);

  return (
    <div className="rules-preview-rules">
      {rules.length === 0
        && <div className="rules-preview-rules__empty">Add rule types from the options below.</div>}
      {rules.length > 0
        && (
        <div className="rules-preview-rules__rules">
          {rules.map(
            (rule, index) => (
              <div className="rules-preview-rules__rule" key={rule.id}>
                <PreviewRule
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...rule}
                  join={getJoin(index)}
                  codebook={codebook}
                  onClick={() => onClickRule(rule.id)}
                  onDelete={() => onDeleteRule(rule.id)}
                />
              </div>
            ),
          )}
        </div>
        )}
    </div>
  );
};

PreviewRules.propTypes = {
  join: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  rules: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  codebook: PropTypes.object.isRequired,
  onClickRule: PropTypes.func.isRequired,
  onDeleteRule: PropTypes.func.isRequired,
};

PreviewRules.defaultProps = {
  join: null,
};

export default PreviewRules;
