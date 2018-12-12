import React from 'react';
import PropTypes from 'prop-types';
import RuleText from './RuleText';

const Join = ({ value }) => (<div>{ value }</div>);
Join.propTypes = { value: PropTypes.string.isRequired };

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

export default PreviewRule;
