/* eslint-disable import/prefer-default-export */

import { mapValues, reduce } from 'lodash';

export const getVariableOptions = type =>
  mapValues(
    type,
    meta =>
      reduce(
        meta.variables,
        (memo, variableMeta, variableId) => [...memo, [variableId, variableMeta.name]],
        [],
      ),
  );
