import { makeGetNetworkAssetVariables } from '@selectors/assets';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const initialResult = {
  dataSource: null,
  variables: [],
  variablesError: null,
};

const useVariablesFromExternalData = (dataSource, asOptions = false) => {
  // Keyed by the dataSource it was fetched for, so a response for a stale
  // dataSource can never overwrite the result of a newer request.
  const [result, setResult] = useState(initialResult);

  const getNetworkAssetVariables = useSelector(makeGetNetworkAssetVariables);

  useEffect(() => {
    if (!dataSource) {
      return undefined;
    }

    let cancelled = false;

    getNetworkAssetVariables(dataSource, asOptions)
      .then((variables) => {
        if (!cancelled) {
          setResult({ dataSource, variables, variablesError: null });
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setResult({
            dataSource,
            variables: [],
            variablesError: e.toString(),
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [dataSource]);

  const isVariablesLoading = !!dataSource && result.dataSource !== dataSource;

  return {
    isVariablesLoading,
    variables: result.variables,
    variablesError: result.variablesError,
  };
};

export default useVariablesFromExternalData;
