import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import { getVariableName } from '../../helpers';
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
      {prompts.map((prompt) => (
        <div key={prompt.id} className="protocol-summary-stage__prompts-prompt">
          <Markdown source={prompt.text} />
          <table>
            <tbody>
              {prompt.additionalAttributes && prompt.additionalAttributes.map(
                ({ variable, value }) => (
                  <tr>
                    <td>{`${getVariableName(index, variable)} ${value}`}</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      ))}
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
