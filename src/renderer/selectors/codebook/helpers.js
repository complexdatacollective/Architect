/* eslint-disable import/prefer-default-export */

import { flatMap } from 'lodash';

const getIdsFromEntity = (entity) => (entity.variables ? Object.keys(entity.variables) : []);

/**
 *
 * @param {*} codebook
 * @returns
 */
export const getIdsFromCodebook = (codebook) => flatMap(
  codebook,
  (entityOrEntities, type) => (
    type === 'ego'
      ? getIdsFromEntity(entityOrEntities)
      : flatMap(entityOrEntities, getIdsFromEntity)
  ),
);
