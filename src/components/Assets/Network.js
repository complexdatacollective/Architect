/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useMemo } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { useTable, useSortBy } from 'react-table';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { getVariableNamesFromNetwork } from '@app/protocol-validation/validation/validateExternalData';
import withAssetPath from './withAssetPath';
import { networkReader } from '../../utils/protocols/assetTools';

const initialContent = {
  network: { nodes: [] },
  columns: [],
};

const getRows = (network) => get(network, ['nodes'], []).map(
  ({ attributes }) => attributes,
);

const getColumns = (network) => getVariableNamesFromNetwork(network).map(
  (col) => ({
    Header: col,
    accessor: col,
  }),
);

const getSortIcon = (column) => {
  if (!column.isSorted) { return null; }
  return (
    column.isSortedDesc
      ? <ArrowDropDownIcon />
      : <ArrowDropUpIcon />
  );
};

const Network = ({ assetPath }) => {
  const [content, setContent] = useState({ ...initialContent });

  useEffect(() => {
    if (!assetPath) {
      setContent({ ...initialContent });
      return;
    }

    networkReader(assetPath)
      .then(setContent);
  }, [assetPath]);

  const data = useMemo(() => getRows(content), [content]);
  const columns = useMemo(() => getColumns(content), [content]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    { data, columns },
    useSortBy,
  );

  return (
    <table {...getTableProps()} className="network">
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps(column.getSortByToggleProps())}
              >
                {column.render('Header')}
                {getSortIcon(column)}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);

          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <td
                  {...cell.getCellProps()}
                >
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

Network.propTypes = {
  assetPath: PropTypes.string.isRequired,
};

export { Network };

export default compose(
  withAssetPath,
)(Network);
