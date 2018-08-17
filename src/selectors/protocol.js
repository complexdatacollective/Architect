/* eslint-disable import/prefer-default-export */

import { createSelector } from 'reselect';
import { find } from 'lodash';

const propStageId = (_, props) => props.stageId;
const activeProtocolId = state => state.session.activeProtocol;
const protocolsMeta = state => state.protocols;

export const getProtocol = state => state.protocol.present;

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

export const getVariableRegistry = createSelector(
  getProtocol,
  protocol => protocol.variableRegistry,
);
