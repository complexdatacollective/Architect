import React, { useContext, useState, useEffect } from 'react';
import { get } from 'lodash';
import { makeGetNetworkAssetVariables, getAssetPath } from '@selectors/assets';
import SummaryContext from './SummaryContext';
import MiniTable from './MiniTable';

const stubState = (assetManifest, workingPath) => ({
  session: { workingPath },
  protocol: { present: { assetManifest } },
});

const useAssetData = (id) => {
  const {
    protocol: { assetManifest },
    workingPath,
  } = useContext(SummaryContext);

  const data = get(assetManifest, id);

  if (!data) { return {}; }

  const [variables, setVariables] = useState(null);

  const stubbedState = stubState(assetManifest, workingPath);

  const getNetworkAssetVariables = makeGetNetworkAssetVariables(stubbedState);
  const assetPath = getAssetPath(stubbedState, id);

  useEffect(() => {
    if (data.type !== 'network') { return; }

    getNetworkAssetVariables(id)
      .then((v) => {
        if (!v) { return; }
        setVariables(v.map((name) => [name]));
      });
  }, []);

  return {
    name: data.name,
    type: data.type,
    variables,
    assetPath,
  };
};

const Asset = ({
  id,
}) => {
  const {
    variables,
    assetPath,
    name,
    type,
  } = useAssetData(id);

  const encodedURI = encodeURIComponent(assetPath);
  const url = `asset://${encodedURI}`;

  return (
    <div className="protocol-summary-asset-manifest__asset" id={`asset-${id}`}>
      <h4>{name}</h4>

      { type === 'image' && (
        <div className="protocol-summary-asset-manifest__asset-image">
          <img src={url} alt="preview" />
        </div>
      )}

      {variables && (
        <MiniTable
          wide
          lite
          rows={
            [
              [<strong>Variables</strong>],
              ...variables,
            ]
          }
        />
      )}
    </div>
  );
};

export default Asset;
