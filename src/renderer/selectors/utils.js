/* eslint-disable import/prefer-default-export */

import { map, pickBy } from 'lodash';

const extraProperties = new Set(['type', 'color']);

const asOption = (item, id) => {
  const required = {
    label: item.name,
    value: id,
  };
  const extra = pickBy(
    item,
    (value, key) => value && extraProperties.has(key),
  );
  return {
    ...extra,
    ...required,
  };
};

export const asOptions = (items) => map(
  items,
  asOption,
);
