/* eslint-env jest */

import testState from '../../../__tests__/testState.json';

export const importAsset = jest.fn((protocolPath, filePath) => Promise.resolve(`${protocolPath}/${filePath}`));
export const saveProtocol = jest.fn(() => Promise.resolve('/dev/null/fake/user/protocol/path'));
export const loadProtocolConfiguration = jest.fn(() => Promise.resolve(testState.protocol.present));
export const createProtocol = jest.fn(() => Promise.resolve({
  filePath: '/dev/null/fake/user/entered/path',
  workingPath: '/dev/null/fake/working/path',
}));
export const unbundleProtocol = jest.fn(() => Promise.resolve('/dev/null/fake/working/path'));
export const bundleProtocol = jest.fn(() => Promise.resolve('/dev/null/fake/working/path'));
