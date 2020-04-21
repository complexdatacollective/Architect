/* eslint-disable import/prefer-default-export */

import { createSelector } from 'reselect';
import { find, reduce } from 'lodash';

const propStageId = (_, props) => props.stageId;

export const getProtocol = state => state.protocol.present;
export const getAssetManifest = state => state.protocol.present.assetManifest;
export const getCodebook = state => state.protocol.present.codebook;

export const makeGetStage = () =>
  createSelector(
    getProtocol,
    propStageId,
    (protocol, stageId) => find(protocol.stages, ['id', stageId]),
  );

const networkTypes = new Set([
  'network',
  'async:network',
]);

// TODO: Does this method make sense here?
export const getNetworkAssets = createSelector(
  getAssetManifest,
  assetManifest =>
    reduce(
      assetManifest,
      (memo, asset, name) => {
        if (!networkTypes.has(asset.type)) { return memo; }

        return { ...memo, [name]: asset };
      },
      {},
    ),
);

