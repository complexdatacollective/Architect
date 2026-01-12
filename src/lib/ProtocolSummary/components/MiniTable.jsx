/* eslint-disable react/no-array-index-key, react/forbid-prop-types */
import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

const MiniTable = ({
  rows, wide, lite, rotated,
}) => {
  const classes = cx(
    'protocol-summary-mini-table',
    { 'protocol-summary-mini-table--wide': wide },
    { 'protocol-summary-mini-table--rotated': rotated },
    { 'protocol-summary-mini-table--lite': lite },
  );

  return (
    <table className={classes}>
      {
        !rotated && (
          <thead>
            <tr key="0">
              {rows[0].map((column, m) => (
                <th key={m}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
        )
      }
      <tbody>
        {([...(!rotated ? [...rows.slice(1)] : rows)]).map((row, n) => (
          <tr key={n}>
            {row.map((column, m) => (
              <td key={m}>
                {column}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

MiniTable.propTypes = {
  rows: PropTypes.array,
  wide: PropTypes.bool,
  lite: PropTypes.bool,
  rotated: PropTypes.bool,
};

MiniTable.defaultProps = {
  rows: [],
  wide: false,
  lite: false,
  rotated: false,
};

export default MiniTable;
