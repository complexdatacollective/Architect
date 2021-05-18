import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import SummaryContext from '../SummaryContext';
import DualLink from '../DualLink';
import SkipLogic from './SkipLogic';
import Subject from './Subject';
import IntroductionPanel from './IntroductionPanel';
import Prompts from './Prompts';
import InterviewScript from './InterviewScript';
import Form from './Form';
import QuickAdd from './QuickAdd';
import DataSource from './DataSource';
import Behaviours from './Behaviours';
import Presets from './Presets';
import Panels from './Panels';
import Items from './Items';

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
            { configuration.skipLogic && (
              <tr>
                <th>Skip Logic</th>
                <td>
                  <SkipLogic skipLogic={configuration.skipLogic} />
                </td>
              </tr>
            )}
            { stageVariables.length > 0 && (
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
        <div className="protocol-summary-stage__content-section">
          <Subject
            subject={configuration.subject}
            filter={configuration.filter}
          />
        </div>
        <div className="protocol-summary-stage__content-section">
          <IntroductionPanel introductionPanel={configuration.introductionPanel} />
        </div>
        <div className="protocol-summary-stage__content-section">
          <DataSource dataSource={configuration.dataSource} />
        </div>
        <div className="protocol-summary-stage__content-section">
          <QuickAdd quickAdd={configuration.quickAdd} />
        </div>
        <div className="protocol-summary-stage__content-section">
          <Panels panels={configuration.panels} />
        </div>
        <div className="protocol-summary-stage__content-section">
          <Prompts prompts={configuration.prompts} />
        </div>
        <div className="protocol-summary-stage__content-section">
          <Form form={configuration.form} />
        </div>
        <div className="protocol-summary-stage__content-section">
          <Behaviours behaviours={configuration.behaviours} />
        </div>
        <div className="protocol-summary-stage__content-section">
          <Presets presets={configuration.presets} />
        </div>
        <div className="protocol-summary-stage__content-section">
          <Items items={configuration.items} />
        </div>
        <div className="protocol-summary-stage__content-section">
          <InterviewScript interviewScript={configuration.interviewScript} />
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
