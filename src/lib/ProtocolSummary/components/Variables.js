import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { toPairs, get, find } from 'lodash';
import Markdown from 'react-markdown';
import { ALLOWED_MARKDOWN_LABEL_TAGS } from '@codaco/ui/src/utils/config';
import SummaryContext from './SummaryContext';
import DualLink from './DualLink';

const getStageName = (protocol) => (stageId) => {
  const stageConfiguration = find(protocol.stages, ['id', stageId]);
  return get(stageConfiguration, 'label');
};

const makeGetUsedIn = (protocol, index) => (variableId) => {
  const stages = get(
    index.find(({ id }) => id === variableId),
    'stages',
    [],
  );

  return stages.map((stageId) => ([
    stageId,
    getStageName(protocol)(stageId),
  ]));
};

const Variables = ({ variables }) => {
  const {
    protocol,
    index,
  } = useContext(SummaryContext);

  const getUsedIn = makeGetUsedIn(protocol, index);

  return (
    <div className="protocol-summary-variables">
      <h2>Variables</h2>

      <table className="protocol-summary-variables__data">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Input Component</th>
            <th>Values</th>
            <th>Usage</th>
          </tr>
        </thead>
        <tbody>
          {toPairs(variables).map(([variableId, variableConfiguration]) => {
            const {
              name,
              component,
              type,
              options,
            } = variableConfiguration;

            return (
              <tr key={variableId}>
                <td>{name}</td>
                <td>{type}</td>
                <td>{component}</td>
                <td>
                  {options && (
                    <table className="protocol-summary-variables__options">
                      {options.map((option) => (
                        <tr key={option.value}>
                          <td>
                            <strong>{option.value}</strong>
                          </td>
                          <td>
                            <Markdown
                              source={option.label}
                              allowedTypes={ALLOWED_MARKDOWN_LABEL_TAGS}
                            />
                          </td>
                        </tr>
                      ))}
                    </table>
                  )}
                </td>
                <td>
                  {getUsedIn(variableId).map(([stageId, stageName]) => (
                    <>
                      <DualLink to={`#stage-${stageId}`}>{stageName}</DualLink>
                      <br />
                    </>
                  ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

Variables.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  variables: PropTypes.object.isRequired,
};

export default Variables;
