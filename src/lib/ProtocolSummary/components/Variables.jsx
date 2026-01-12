/* eslint-disable react/no-array-index-key */

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import {
  toPairs, get, find, isEmpty, sortBy,
} from 'lodash';
import Markdown from '@codaco/ui/lib/components/Fields/Markdown';
import { SimpleVariablePill } from '@components/Form/Fields/VariablePicker/VariablePill';
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

  const sortedVariables = sortBy(
    toPairs(variables),
    [(variable) => variable[1].name.toLowerCase()],
  );

  return (
    <div className="protocol-summary-variables">
      <table className="protocol-summary-variables__data">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Used In</th>
          </tr>
        </thead>
        <tbody>
          { isEmpty(variables) && (
            <tr className="empty">
              <td colSpan={3}>No variables to display.</td>
            </tr>
          )}
          {sortedVariables.map(([variableId, variableConfiguration]) => {
            const {
              name,
              type,
              options,
            } = variableConfiguration;

            const indexEntry = index.find(({ id }) => id === variableId);

            const optionsRows = options && options.map(({ value, label }) => ([
              renderValue(value),
              <Markdown
                label={label}
              />,
            ]));

            return (
              <tr key={variableId} id={`variable-${variableId}`}>
                <td><SimpleVariablePill label={name} type={type} /></td>
                <td>
                  {type}
                  <br />
                  <br />
                  {options && (<MiniTable rows={[['Value', 'Label'], ...optionsRows]} />)}
                </td>
                <td>
                  {getUsedIn(indexEntry).map(([stageId, stageName], n) => (
                    <React.Fragment key={n}>
                      <DualLink to={`#stage-${stageId}`}>{stageName}</DualLink>
                      <br />
                    </React.Fragment>
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
  variables: PropTypes.object,
};

Variables.defaultProps = {
  variables: null,
};

export default Variables;
