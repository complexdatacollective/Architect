import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { makeGetNetworkAssetVariables } from '@selectors/assets';

const initialState = {
  isVariablesLoading: false,
  variables: [],
  variablesError: null,
};

const useVariablesFromExternalData = (dataSource, asOptions = false) => {
  const [state, setState] = useState(initialState);

  const getNetworkAssetVariables = useSelector(makeGetNetworkAssetVariables);

  useEffect(() => {
    if (!dataSource) { return; }

    setState({ isVariableLoading: true, variables: [], variablesError: null });

    getNetworkAssetVariables(dataSource, asOptions)
      .then((variables) => {
        setState(s => ({ ...s, isVariablesLoading: false, variables }));
      })
      .catch((e) => {
        setState(s => ({
          ...s,
          isVariablesLoading: false,
          variablesError: e.toString(),
        }));
      });
  }, [dataSource]);

  return state;
};

export default useVariablesFromExternalData;
