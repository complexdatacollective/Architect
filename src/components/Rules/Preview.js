import React from 'react';
import PropTypes from 'prop-types';
import RuleText from './RuleText';

const Join = ({ value }) => (<div>{ value }</div>);
Join.propTypes = { value: PropTypes.string.isRequired };

// TODO: Move this to RulePreview.js
const Rule = ({ id, type, options, assert, join, onClick }) => (
  <div onClick={() => onClick(id)}>
    <RuleText type={type} options={options} assert={assert} />
    { join && <Join value={join} /> }
  </div>
);

const Preview = ({ join, rules, onClickRule }) => (
  <div>
    {rules.map(
      (rule, index) => (
        <Rule
          {...rule}
          join={index !== rules.length && join}
          onClick={() => onClickRule(rule.id)}
        />
      ),
    )}
  </div>
);

export { Preview };

export default Preview;
