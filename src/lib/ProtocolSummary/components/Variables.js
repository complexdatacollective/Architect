import React from 'react';
import { toPairs, get } from 'lodash';

const Variables = ({ variables, codebook }) => (
  <div>
    Variables

    <table>
      <tbody>
        {toPairs(variables).map(([variableId, variableConfiguration]) => {
          const {
            name,
            component,
            type,
          } = variableConfiguration;

          const stages = get(
            codebook.find(({ id }) => id === variableId),
            'stages',
          ).join(',');

          return (
            <tr>
              <td>{name}</td>
              <td>{type}</td>
              <td>{component}</td>
              <td>Usage</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default Variables;
