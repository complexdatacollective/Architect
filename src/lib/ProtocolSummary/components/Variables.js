import React, { useContext } from 'react';
import { toPairs, get } from 'lodash';
import SummaryContext from './SummaryContext';

const usedIn = (protocol, index) => (variableId) => {
  const stages = get(
    index.find(({ id }) => id === variableId),
    'stages',
  );

  return stages;
};

const Variables = ({ variables }) => {
  const {
    index,
  } = useContext(SummaryContext);

  return (
    <div>
      <h2>Variables</h2>

      <table>
        <thead>
          <th>Name</th>
          <th>Type</th>
          <th>Input Component</th>
          <th>Usage</th>
        </thead>
        <tbody>
          {toPairs(variables).map(([variableId, variableConfiguration]) => {
            const {
              name,
              component,
              type,
            } = variableConfiguration;

            return (
              <tr>
                <td>{name}</td>
                <td>{type}</td>
                <td>{component}</td>
                <td>{usedIn(null, index)(variableId)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Variables;
