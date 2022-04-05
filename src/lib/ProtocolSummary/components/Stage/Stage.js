import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { get, isEmpty, sortBy } from 'lodash';
import interfaceImage from '@app/images/timeline';
import SummaryContext from '../SummaryContext';
import DualLink from '../DualLink';
import SkipLogic from './SkipLogic';
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
import PageHeading from './PageHeading';
import EntityBadge from '../EntityBadge';
import MiniTable from '../MiniTable';
import Filter from './Filter';

const getInterfaceImage = (type) => get(interfaceImage, type);

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

  const stageVariables = sortBy(
    variablesOnStage(index)(id),
    [(variable) => variable[1].toLowerCase()],
  );

  return (
    <div className="protocol-summary-stage page-break-marker" id={`stage-${id}`}>
      <div className="protocol-summary-stage__heading">
        <div className="protocol-summary-stage__wrapper">
          <div className="protocol-summary-stage__summary">
            <div className="stage-label" data-number={stageNumber}><h1>{label}</h1></div>
            {configuration.subject && !isEmpty(stageVariables) && (
              <table className="protocol-summary-mini-table protocol-summary-mini-table--rotated">
                <tbody>
                  { configuration.subject && (
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
                  { !isEmpty(stageVariables) && (
                    <tr>
                      <td>Variables</td>
                      <td>
                        { stageVariables.map(([variableId, variable], i) => (
                          <React.Fragment key={variableId}>
                            <DualLink to={`#variable-${variableId}`}>{variable}</DualLink>
                            { i !== stageVariables.length - 1 && ', '}
                          </React.Fragment>
                        )) }
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
        { configuration.filter && (
          <div className="protocol-summary-stage__heading-section">
            <div className="protocol-summary-stage__heading-section-content">
              <h2 className="section-heading">Network Filtering</h2>
              <MiniTable
                rotated
                wide
                rows={[
                  ['Rules', <Filter filter={configuration.filter} />],
                ]}
              />
            </div>
          </div>
        )}
        { configuration.skipLogic && (
          <div className="protocol-summary-stage__heading-section">
            <div className="protocol-summary-stage__heading-section-content">
              <h2 className="section-heading">Skip Logic</h2>
              <SkipLogic skipLogic={configuration.skipLogic} />
            </div>
          </div>
        )}
        <div className="protocol-summary-stage__content">
          <IntroductionPanel introductionPanel={configuration.introductionPanel} />
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
  // eslint-disable-next-line react/forbid-prop-types
  configuration: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  stageNumber: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
};

export default Stage;
