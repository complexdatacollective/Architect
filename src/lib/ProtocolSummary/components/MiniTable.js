/* eslint-disable react/no-array-index-key, react/forbid-prop-types */
import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

const MiniTable = ({ rows, wide }) => {
  const classes = cx(
    'protocol-summary-mini-table',
    { 'protocol-summary-mini-table--wide': wide },
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
};

MiniTable.defaultProps = {
  rows: [],
  wide: false,
};

export default MiniTable;
