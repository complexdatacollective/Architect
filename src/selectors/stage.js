/* eslint-disable import/prefer-default-export */

import { createSelector } from 'reselect';
import { find } from 'lodash';
import { getProtocol } from './protocol';

const propStageId = (_, props) => props.stageId;

const makeGetStage = () =>
  createSelector(
    getProtocol,
    propStageId,
    (protocol, stageId) => find(protocol.stages, ['id', stageId]),
  );

export { makeGetStage };
