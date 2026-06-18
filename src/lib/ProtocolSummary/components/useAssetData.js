import { getAssetPath, makeGetNetworkAssetVariables } from '@selectors/assets';
import { get } from 'lodash';
import { useContext, useEffect, useState } from 'react';

import SummaryContext from './SummaryContext';

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
  const [variables, setVariables] = useState(null);

  const stubbedState = stubState(assetManifest, workingPath);
  const getNetworkAssetVariables = makeGetNetworkAssetVariables(stubbedState);
  const assetPath = data ? getAssetPath(stubbedState, id) : null;

  useEffect(() => {
    if (!data || data.type !== 'network') {
      return;
    }

    getNetworkAssetVariables(id).then((v) => {
      if (!v) {
        return;
      }
      setVariables(v.join(', '));
    });
  }, []);

  if (!data) {
    return {};
  }

  const encodedURI = encodeURIComponent(assetPath);
  const url = `asset://${encodedURI}`;

  return {
    name: data.name,
    type: data.type,
    variables,
    assetPath,
    url,
  };
};

export default useAssetData;
