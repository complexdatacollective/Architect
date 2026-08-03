import { get } from 'lodash';
import PropTypes from 'prop-types';
import { getVariableNamesFromNetwork } from 'protocol-validation/validation/validateExternalData';
import { useEffect, useMemo, useState } from 'react';
import { compose } from 'redux';

import { networkReader } from '../../utils/protocols/assetTools';
import Table from './Table';
import withAssetPath from './withAssetPath';

const initialContent = {
  network: { nodes: [] },
  columns: [],
};

const getRows = (network) =>
  get(network, ['nodes'], []).map(({ attributes }) => attributes);

const getColumns = (network) =>
  getVariableNamesFromNetwork(network).map((col) => ({
    Header: col,
    accessor: col,
  }));

const Network = ({ assetPath }) => {
  const [content, setContent] = useState({ ...initialContent });

  useEffect(() => {
    if (!assetPath) {
      setContent({ ...initialContent });
      return;
    }

    networkReader(assetPath).then(setContent);
  }, [assetPath]);

  const data = useMemo(() => getRows(content), [content]);
  const columns = useMemo(() => getColumns(content), [content]);

  return <Table data={data} columns={columns} />;
};

Network.propTypes = {
  assetPath: PropTypes.string.isRequired,
};

export default compose(withAssetPath)(Network);
