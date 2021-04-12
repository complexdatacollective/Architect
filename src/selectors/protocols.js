import { find } from 'lodash';

export const getProtocols = (state) => state.protocols;

export const getProtocolMeta = (state, protocolId) => find(getProtocols(state), ['id', protocolId]);

export const getActiveProtocolId = (state) => state.session.activeProtocol;

export const getActiveProtocolMeta = (state) => {
  const activeProtocolId = getActiveProtocolId(state);
  return find(getProtocols(state), ['id', activeProtocolId]);
};
