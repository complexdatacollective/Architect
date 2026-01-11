import { vi } from 'vitest';

import testState from '../../../__tests__/testState.json';

export const importAsset = vi.fn((protocolPath, filePath) => Promise.resolve(`${protocolPath}/${filePath}`));
export const saveProtocol = vi.fn(() => Promise.resolve('/dev/null/fake/user/protocol/path'));
export const loadProtocolConfiguration = vi.fn(() => Promise.resolve(testState.protocol.present));
export const createProtocol = vi.fn(() => Promise.resolve({
  filePath: '/dev/null/fake/user/entered/path',
  workingPath: '/dev/null/fake/working/path',
}));
export const unbundleProtocol = vi.fn(() => Promise.resolve('/dev/null/fake/working/path'));
export const bundleProtocol = vi.fn(() => Promise.resolve('/dev/null/fake/working/path'));
