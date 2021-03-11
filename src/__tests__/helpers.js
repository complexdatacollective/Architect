/* eslint-env jest */
/* eslint-disable import/prefer-default-export */

import testState from './testState.json';
import developmentProtocol from '../../development-protocol/protocol.json';

export const getMockState = (mergeProps) => ({
  ...testState,
  protocol: {
    present: developmentProtocol,
  },
  ...mergeProps,
});
