/* eslint-disable import/prefer-default-export */

import { createSelector } from 'reselect';
import { find } from 'lodash';

const propStageId = (_, props) => props.stageId;

export const getProtocol = state => state.protocol.present;

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
