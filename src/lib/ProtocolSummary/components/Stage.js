import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import SummaryContext from './SummaryContext';

const stageVariables = (index) => (stageId) => index
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
          { stageVariables(index)(id) }
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
              <li key={prompt.id}>{prompt.text}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

Stage.propTypes = {
  stageNumber: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  configuration: PropTypes.object.isRequired,
};

export default Stage;
