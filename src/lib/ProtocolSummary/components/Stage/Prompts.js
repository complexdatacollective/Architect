import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import SummaryContext from '../SummaryContext';
import DualLink from '../DualLink';

const Prompts = ({
  prompts,
}) => {
  const {
    index,
  } = useContext(SummaryContext);

  if (!prompts) { return null; }

  return (
    <div className="protocol-summary-stage__prompts">
      <h2>Prompts</h2>
      <ol>
        {prompts.map((prompt) => (
          <li key={prompt.id}><Markdown source={prompt.text} /></li>
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
  prompts: [],
};

export default Prompts;
