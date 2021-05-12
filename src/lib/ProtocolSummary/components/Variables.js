import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { toPairs, get, find } from 'lodash';
import Markdown from 'react-markdown';
import { ALLOWED_MARKDOWN_LABEL_TAGS } from '@codaco/ui/src/utils/config';
import SummaryContext from './SummaryContext';
import DualLink from './DualLink';
import MiniTable from './MiniTable';
import { renderValue } from './helpers';

const getStageName = (protocol) => (stageId) => {
  const stageConfiguration = find(protocol.stages, ['id', stageId]);
  return get(stageConfiguration, 'label');
};

// TODO: Make this part of the index?
const makeGetUsedIn = (protocol) => (indexEntry) => {
  const stages = get(indexEntry, 'stages', []);

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
            <th>Detail</th>
            <th>Usage</th>
          </tr>
        </thead>
        <tbody>
          {toPairs(variables).map(([variableId, variableConfiguration]) => {
            const {
              name,
              type,
              options,
            } = variableConfiguration;

            const indexEntry = index.find(({ id }) => id === variableId);

            const optionsRows = options && options.map(({ value, label }) => ([
              <em>{renderValue(value)}</em>,
              <Markdown
                source={label}
                allowedTypes={ALLOWED_MARKDOWN_LABEL_TAGS}
              />,
            ]));

            return (
              <tr key={variableId} id={`variable-${variableId}`}>
                <td>{name}</td>
                <td>{type}</td>
                <td>
                  <table className="protocol-summary-variables__details">
                    <tbody>
                      {indexEntry && indexEntry.prompt && (
                        <tr>
                          <th>Label</th>
                          <td><Markdown source={indexEntry.prompt} /></td>
                        </tr>
                      )}
                      {options && (
                        <tr>
                          <th>Values</th>
                          <td><MiniTable rows={optionsRows} /></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </td>
                <td>
                  {getUsedIn(indexEntry).map(([stageId, stageName]) => (
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
