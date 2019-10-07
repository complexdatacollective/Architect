/* eslint-disable import/prefer-default-export */

import { createSelector } from 'reselect';
import { find, reduce } from 'lodash';
import { getFormValues } from 'redux-form';

const propStageId = (_, props) => props.stageId;
const activeProtocolId = state => state.session.activeProtocol;
const protocolsMeta = state => state.protocols;

/**
 * Get protocol from app state
 * @param {object} state app state
 * @param {object} options options for protocol, including `includeDraft`, to merge
 * in 'edit-stage' form state.
 */
export const getProtocol = (state, options = {}) => {
  const { includeDraft = false } = options;

  if (includeDraft) {
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

/**
 * Get codebook from app state
 * @param {object} state app state
 * @param {object} options options for getProtocol `{ includeDraft }`
 */
export const getCodebook = (state, options) => {
  const protocol = getProtocol(state, options);
  return protocol.codebook;
};

/**
 * Get asset manifest from app state
 * @param {object} state app state
 * @param {object} options options for getProtocol `{ includeDraft }`
 */
export const getAssetManifest = (state, options) => {
  const protocol = getProtocol(state, options);
  return protocol.assetManifest;
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

