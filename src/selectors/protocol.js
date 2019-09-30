/* eslint-disable import/prefer-default-export */

import { createSelector } from 'reselect';
import { find, reduce } from 'lodash';
import { getFormValues } from 'redux-form';

const propStageId = (_, props) => props.stageId;
const activeProtocolId = state => state.session.activeProtocol;
const protocolsMeta = state => state.protocols;

// export const getProtocol = state => state.protocol.present;
export const getAssetManifest = state => state.protocol.present.assetManifest;
export const getCodebook = state => state.protocol.present.codebook;

export const getProtocol = (state, options = {}) => {
  const { includeDraftStage = false } = options;
  if (includeDraftStage) {
    const draftStage = getFormValues('edit-stage')(state);

    if (draftStage.id) {
      return {
        ...state.protocol.present,
        stages: state.protocol.present.stages.map((stage) => {
          if (!draftStage.id !== stage.id) { return stage; }
          return { id: draftStage.id, ...draftStage };
        }),
      };
    }

    const insertAt = state.protocol.present.stages.length;

    return {
      ...state.protocol.present,
      stages: [
        ...state.protocol.present.stages.slice(0, insertAt),
        draftStage,
        ...state.protocol.present.stages.slice(insertAt),
      ],
    };
  }

  return state.protocol.present;
};

export const getActiveProtocolMeta = createSelector(
  protocolsMeta,
  activeProtocolId,
  (meta, id) => find(meta, ['id', id]),
);

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

