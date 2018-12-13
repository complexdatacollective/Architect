import React from 'react';
import PropTypes from 'prop-types';
import { withProps } from 'recompose';
import { get } from 'lodash';
import RuleText, { Join } from './RuleText';

// convert options to labels
const withDisplayOptions = withProps(({ type, options, variableRegistry }) => {
  const entityType = type === 'edge' ? 'edge' : 'node';
  const typeLabel = get(variableRegistry, [entityType, options.type, 'label'], options.type);
  const variableLabel = get(
    variableRegistry,
    [entityType, options.type, 'variables', options.variable, 'label'],
    options.variable,
  );

  return {
    options: {
      ...options,
      type: typeLabel,
      variable: variableLabel,
    },
  };
});

const PreviewRule = ({ id, type, options, join, onClick }) => (
  <div
    className="rules-preview-rule"
    onClick={() => onClick(id)}
  >
    <RuleText type={type} options={options} />
    { join && <Join value={join} /> }
  </div>
);

PreviewRule.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
  join: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export { PreviewRule };
export default withDisplayOptions(PreviewRule);
