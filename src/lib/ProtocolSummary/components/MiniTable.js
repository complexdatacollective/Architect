/* eslint-disable react/no-array-index-key, react/forbid-prop-types */
import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

const MiniTable = ({ rows, wide, lite }) => {
  const classes = cx(
    'protocol-summary-mini-table',
    { 'protocol-summary-mini-table--wide': wide },
    { 'protocol-summary-mini-table--lite': lite },
  );

  return (
    <table className={classes}>
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
};

MiniTable.propTypes = {
  rows: PropTypes.array,
  wide: PropTypes.bool,
  lite: PropTypes.bool,
};

MiniTable.defaultProps = {
  rows: [],
  wide: false,
  lite: false,
};

export default MiniTable;
