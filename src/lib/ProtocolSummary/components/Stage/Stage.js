import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import EntityBadge from '../EntityBadge';
import SummaryContext from '../SummaryContext';
import DualLink from '../DualLink';
import Prompts from './Prompts';
import InterviewScript from './InterviewScript';

const variablesOnStage = (index) => (stageId) => index
  .reduce(
    (memo, variable) => {
      if (!variable.stages.includes(stageId)) { return memo; }
      return [...memo, [variable.id, variable.name]];
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
  const { subject } = configuration;

  return (
    <div className="protocol-summary-stage" id={`stage-${id}`}>
      <div className="protocol-summary-stage__heading">
        <h1>
          {stageNumber}
          {'. '}
          {label}
        </h1>

        <table className="protocol-summary-stage__meta">
          <tbody>
            <tr>
              <th>Type</th>
              <td>{type}</td>
            </tr>
            { configuration.subject && (
              <tr>
                <th className="protocol-summary-stage__meta-subject-title">Subject</th>
                <td>
                  <EntityBadge type={subject.type} entity={subject.entity} link small />
                </td>
              </tr>
            )}
            {stageVariables.length > 0 && (
              <tr>
                <th>Variables</th>
                <td>
                  { stageVariables.map(([variableId, variable]) => (
                    <>
                      <DualLink to={`#variable-${variableId}`} key={variableId}>{variable}</DualLink>
                      <br key={`br-${variableId}`} />
                    </>
                  )) }
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="protocol-summary-stage__content">
        <Prompts prompts={configuration.prompts} />
        <InterviewScript interviewScript={configuration.interviewScript} />
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
