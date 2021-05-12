/* eslint-disable react/no-array-index-key, react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';

const MiniTable = ({ rows }) => (
  <table className="protocol-summary-mini-table">
    <tbody>
      {rows.map((row, index) => (
        <tr key={index}>
          {row.map((column) => (
            <td>
              {column}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

MiniTable.propTypes = {
  rows: PropTypes.array,
};

MiniTable.defaultProps = {
  rows: [],
};

export default MiniTable;
