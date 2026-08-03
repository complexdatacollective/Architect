import interfaceImage from '@app/images/timeline';
import { get, isEmpty, sortBy } from 'lodash';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';

import DualLink from '../DualLink';
import EntityBadge from '../EntityBadge';
import MiniTable from '../MiniTable';
import SummaryContext from '../SummaryContext';
import Behaviours from './Behaviours';
import DataSource from './DataSource';
import Filter from './Filter';
import Form from './Form';
import InterviewScript from './InterviewScript';
import IntroductionPanel from './IntroductionPanel';
import Items from './Items';
import PageHeading from './PageHeading';
import Panels from './Panels';
import Presets from './Presets';
import Prompts from './Prompts';
import QuickAdd from './QuickAdd';
import SkipLogic from './SkipLogic';

const getInterfaceImage = (type) => get(interfaceImage, type);

const variablesOnStage = (index) => (stageId) =>
  index.reduce((memo, variable) => {
    if (!variable.stages.includes(stageId)) {
      return memo;
    }
    memo.push([variable.id, variable.name]);
    return memo;
  }, []);

const Stage = ({ configuration, id, label, stageNumber, type }) => {
  const { index } = useContext(SummaryContext);

  const stageVariables = sortBy(variablesOnStage(index)(id), [
    (variable) => variable[1].toLowerCase(),
  ]);

  return (
    <div
      className="protocol-summary-stage page-break-marker"
      id={`stage-${id}`}
    >
      <div className="protocol-summary-stage__heading">
        <div className="protocol-summary-stage__wrapper">
          <div className="protocol-summary-stage__summary">
            <div className="stage-label" data-number={stageNumber}>
              <h1>{label}</h1>
            </div>
            {configuration.subject && !isEmpty(stageVariables) && (
              <table className="protocol-summary-mini-table protocol-summary-mini-table--rotated">
                <tbody>
                  {configuration.subject && (
                    <tr>
                      <td>Subject</td>
                      <td>
                        <EntityBadge
                          small
                          type={configuration.subject.type}
                          entity={configuration.subject.entity}
                          link
                        />
                      </td>
                    </tr>
                  )}
                  {!isEmpty(stageVariables) && (
                    <tr>
                      <td>Variables</td>
                      <td>
                        {stageVariables.map(([variableId, variable], i) => (
                          <React.Fragment key={variableId}>
                            <DualLink to={`#variable-${variableId}`}>
                              {variable}
                            </DualLink>
                            {i !== stageVariables.length - 1 && ', '}
                          </React.Fragment>
                        ))}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
          <div className="protocol-summary-stage__preview">
            <div className="stage-image">
              <img src={getInterfaceImage(type)} alt="" />
            </div>
            {/* <h4>
              {type}
            </h4> */}
          </div>
        </div>
        {configuration.filter && (
          <div className="protocol-summary-stage__heading-section">
            <div className="protocol-summary-stage__heading-section-content">
              <h2 className="section-heading">Network Filtering</h2>
              <MiniTable
                rotated
                wide
                rows={[
                  [
                    'Rules',
                    <Filter key="filter" filter={configuration.filter} />,
                  ],
                ]}
              />
            </div>
          </div>
        )}
        {configuration.skipLogic && (
          <div className="protocol-summary-stage__heading-section">
            <div className="protocol-summary-stage__heading-section-content">
              <h2 className="section-heading">Skip Logic</h2>
              <SkipLogic skipLogic={configuration.skipLogic} />
            </div>
          </div>
        )}
        <div className="protocol-summary-stage__content">
          <IntroductionPanel
            introductionPanel={configuration.introductionPanel}
          />
          <DataSource dataSource={configuration.dataSource} />
          <QuickAdd quickAdd={configuration.quickAdd} />
          <Panels panels={configuration.panels} />
          <Prompts prompts={configuration.prompts} />
          <Form form={configuration.form} />
          <Behaviours behaviours={configuration.behaviours} />
          <Presets presets={configuration.presets} />
          <PageHeading heading={configuration.title} />
          <Items items={configuration.items} />
          <InterviewScript interviewScript={configuration.interviewScript} />
        </div>
      </div>
    </div>
  );
};

Stage.propTypes = {
  id: PropTypes.string.isRequired,
  configuration: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  stageNumber: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
};

export default Stage;
