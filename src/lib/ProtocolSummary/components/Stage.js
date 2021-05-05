import React, { useContext } from 'react';
import SummaryContext from './SummaryContext';

const stageVariables = (codebook, stageId) => codebook
  .reduce(
    (memo, variable) => {
      if (!variable.stages.includes(stageId)) { return memo; }
      return [...memo, variable.name];
    },
    [],
  )
  .join(', ');

const Stage = ({
  stageNumber,
  type,
  label,
  id,
  configuration,
}) => {
  const {
    index,
  } = useContext(SummaryContext);

  return (
    <div>
      <div>
        <h1>
          {stageNumber}
          {'. '}
          {label}
        </h1>

        <div>
          {type}
        </div>

        <div>
          <h2>Variables</h2>
          { stageVariables(index, id) }
        </div>
      </div>

      { configuration.interviewScript && (
        <div>
          <h2>Script</h2>
          {configuration.interviewScript}
        </div>
      )}

      { configuration.prompts && (
        <div>
          <h2>Prompts</h2>
          <ol>
            {configuration.prompts.map((prompt) => (
              <li>{prompt.text}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default Stage;
