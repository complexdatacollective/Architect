import React from 'react';
import PropTypes from 'prop-types';
import RuleText from './RuleText';

const Join = ({ value }) => (<div>{ value }</div>);
Join.propTypes = { value: PropTypes.string.isRequired };

const PreviewRule = ({ id, type, options, assert, join, onClick }) => (
  <div
    className="rules-preview-rule"
    onClick={() => onClick(id)}
  >
    <RuleText type={type} options={options} assert={assert} />
    { join && <Join value={join} /> }
  </div>
);

export default PreviewRule;
