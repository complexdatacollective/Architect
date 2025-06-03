import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { makeGetNetworkAssetVariables, makeGetGeoJsonAssetVariables } from '@selectors/assets';

const initialState = {
  isVariablesLoading: false,
  variables: [],
  variablesError: null,
};

const useVariablesFromExternalData = (dataSource, asOptions = false, type = 'network') => {
  const [state, setState] = useState(initialState);

  const getNetworkAssetVariables = useSelector(makeGetNetworkAssetVariables);
  const getGeojsonAssetVariables = useSelector(makeGetGeoJsonAssetVariables);

  useEffect(() => {
    if (!dataSource) { return; }

    setState({ isVariablesLoading: true, variables: [], variablesError: null });

    const getVariables = type === 'geojson' ? getGeojsonAssetVariables : getNetworkAssetVariables;

    getVariables(dataSource, asOptions)
      .then((variables) => {
        setState((s) => ({ ...s, isVariablesLoading: false, variables }));
      })
      .catch((e) => {
        setState((s) => ({
          ...s,
          isVariablesLoading: false,
          variablesError: e.toString(),
        }));
      });
  }, [dataSource, type]);

  return state;
};

export default useVariablesFromExternalData;
