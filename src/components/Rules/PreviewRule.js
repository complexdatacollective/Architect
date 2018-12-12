import React from 'react';
import PropTypes from 'prop-types';
import { withProps } from 'recompose';
import { get } from 'lodash';
import RuleText, { Join } from './RuleText';

// convert options to labels
const withDisplayOptions = withProps(({ options, variableRegistry }) => {
  const type = get(variableRegistry, ['node', options.type, 'label']);
  const variable = get(
    variableRegistry,
    ['node', options.type, 'variables', options.variable, 'label'],
  );

  return {
    options: {
      ...options,
      type,
      variable,
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
