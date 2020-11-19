import { toPairs, isArray, isEmpty, isObject, isNull } from 'lodash';

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

const shouldPrune = x =>
  isNull(x) || (isObject(x) && isEmpty(x)) || (isArray(x) && x.length === 0);

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

const pruneProtocol = protocol =>
  new Promise((resolve) => {
    const simplifiedProtocol = pruneObjects(protocol);

    const protocolJson = JSON.stringify(simplifiedProtocol);
    const protocolObject = JSON.parse(protocolJson);

    return resolve(protocolObject);
  });

export default pruneProtocol;
