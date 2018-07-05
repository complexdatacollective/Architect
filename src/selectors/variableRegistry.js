/* eslint-disable import/prefer-default-export */

import { get } from 'lodash';
import { getProtocol } from './protocol';

const getNodeTypes = state =>
  get(getProtocol(state).variableRegistry, 'node', {});

const getVariablesForNodeType = (state, nodeType) =>
  get(getNodeTypes(state), [nodeType, 'variables'], {});

export { getNodeTypes, getVariablesForNodeType };
