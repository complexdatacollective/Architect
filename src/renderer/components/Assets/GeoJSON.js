import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import { get } from 'lodash';
import fs from 'fs-extra';
import Table from './Table';
import withAssetPath from './withAssetPath';

const initialContent = {
  geojson: { features: [] },
  columns: [],
};

const getGeoJSON = (assetPath) => fs.readJson(assetPath);

const getRows = (geojson) => get(geojson, ['features'], []).map(
  ({ properties }) => properties,
);

const getColumns = (geojson) => {
  const properties = get(geojson, ['features'], []).map(
    (feature) => feature.properties,
  );

  const columnNames = Array.from(
    new Set(properties.flatMap(Object.keys)),
  );

  return columnNames.map((col) => ({
    Header: col,
    accessor: col,
  }));
};

const GeoJSONTable = ({ assetPath }) => {
  const [content, setContent] = useState({ ...initialContent });

  useEffect(() => {
    if (!assetPath) {
      setContent({ ...initialContent });
      return;
    }

    getGeoJSON(assetPath)
      .then(setContent);
  }, [assetPath]);

  const data = useMemo(() => getRows(content), [content]);
  const columns = useMemo(() => getColumns(content), [content]);

  return <Table data={data} columns={columns} />;
};

GeoJSONTable.propTypes = {
  assetPath: PropTypes.string.isRequired,
};

export default withAssetPath(GeoJSONTable);
