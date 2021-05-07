import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import SummaryContext from './SummaryContext';

const variablesOnStage = (index) => (stageId) => index
  .reduce(
    (memo, variable) => {
      if (!variable.stages.includes(stageId)) { return memo; }
      return [...memo, variable.name];
    },
    [],
  );

const Stage = ({
  configuration,
  id,
  label,
  stageNumber,
  type,
}) => {
  const {
    index,
  } = useContext(SummaryContext);

  const stageVariables = variablesOnStage(index)(id);

  return (
    <div className="protocol-summary-stage">
      <div className="protocol-summary-stage__heading">
        <h1>
          {stageNumber}
          {'. '}
          {label}
        </h1>

        <table className="protocol-summary-stage__meta">
          <tr>
            <th>Type</th>
            <td>{type}</td>
          </tr>
          <tr>
            <th>Subject</th>
            <td></td>
          </tr>
          {stageVariables.length > 0 && (
            <tr>
              <th>Variables</th>
              <td>
                { stageVariables.map((variable) => (
                  <>
                    {variable}
                    <br />
                  </>
                )) }
              </td>
            </tr>
          )}
        </table>
      </div>

      <div className="protocol-summary-stage__content">

        { configuration.prompts && (
          <div className="protocol-summary-stage__prompts">
            <h2>Prompts</h2>
            <ol>
              {configuration.prompts.map((prompt) => (
                <li key={prompt.id}><Markdown source={prompt.text} /></li>
              ))}
            </ol>
          </div>
        )}

        <div className="protocol-summary-stage__script">
          <h2>Script</h2>
          <div className="protocol-summary-stage__script-content">
            {configuration.interviewScript}
          </div>
        </div>
      </div>
    </div>
  );
};

Stage.propTypes = {
  id: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  configuration: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  stageNumber: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
};

export default Stage;
