import React, { useState, useEffect, useMemo } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { useTable } from 'react-table';
import { getVariableNamesFromNetwork } from '@app/protocol-validation/validation/validateExternalData';
import withAssetPath from './withAssetPath';
import withAssetMeta from './withAssetMeta';
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

const Network = ({ assetPath, meta }) => {
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
  } = useTable({ data, columns });

  return (
    <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                style={{
                  borderBottom: 'solid 3px red',
                  background: 'aliceblue',
                  color: 'black',
                  fontWeight: 'bold',
                }}
              >
                {column.render('Header')}
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
                  style={{
                    padding: '10px',
                    border: 'solid 1px gray',
                    background: 'papayawhip',
                  }}
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

  // return (
  //   <div>
  //     <pre>
  //       {JSON.stringify(content, null, 2)}
  //     </pre>
  //   </div>
  // );
};

Network.propTypes = {
  assetPath: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export { Network };

export default compose(
  withAssetPath,
  withAssetMeta,
)(Network);
