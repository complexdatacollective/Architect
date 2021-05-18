/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import PropTypes from 'prop-types';
import Prompt from './Prompt';

const Prompts = ({
  prompts,
}) => {
  if (!prompts) { return null; }

  return (
    <div className="protocol-summary-stage__prompts">
      <h2>Prompts</h2>
      <ol>
        {prompts.map((prompt) => (
          <li key={prompt.id}>
            <Prompt {...prompt} />
          </li>
        ))}
      </ol>
    </div>
  );
};

const PromptType = PropTypes.shape({
  id: PropTypes.string,
  text: PropTypes.string,
});

Prompts.propTypes = {
  prompts: PropTypes.arrayOf(PromptType),
};

Prompts.defaultProps = {
  prompts: null,
};

export default Prompts;
