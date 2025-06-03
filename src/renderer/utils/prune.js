import {
  toPairs, isArray, isEmpty, isObject, isNull, isUndefined,
} from 'lodash';

const assignForType = (memo, key, value) => {
  if (isArray(memo)) {
    return [
      ...memo,
      value,
    ];
  }

  return {
    ...memo,
    [key]: value,
  };
};

const shouldPrune = (x) => isNull(x)
  || isUndefined(x)
  || (isObject(x) && isEmpty(x))
  || (isArray(x) && x.length === 0);

const pruneObjects = (obj) => {
  const getNextValue = (value) => {
    if (isObject(value) || isArray(value)) {
      return pruneObjects(value);
    }

    return value;
  };

  return toPairs(obj).reduce(
    (memo, [key, value]) => {
      const nextValue = getNextValue(value);

      // Ditch nulls and empties
      if (shouldPrune(nextValue)) { return memo; }

      return assignForType(memo, key, nextValue);
    },
    (isArray(obj) ? [] : {}),
  );
};

// TODO: Should not remove top-level elements like stages or codebook
const pruneProtocol = (protocol) => new Promise((resolve) => {
  const {
    stages, codebook, assetManifest, ...rest
  } = protocol;

  const prunedProtocol = {
    stages: stages.map(pruneObjects),
    codebook: pruneObjects(codebook),
    assetManifest: pruneObjects(assetManifest),
    ...pruneObjects(rest),
  };

  const protocolString = JSON.stringify(prunedProtocol);
  const result = JSON.parse(protocolString);

  return resolve(result);
});

export { pruneProtocol };

export default pruneObjects;
