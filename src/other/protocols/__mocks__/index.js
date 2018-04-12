/* eslint-env jest */

export const importAssetToProtocol = jest.fn((protocolPath, filePath) => Promise.resolve(`${protocolPath}/${filePath}`));
export const saveProtocol = jest.fn(() => Promise.resolve());
export const exportProtocol = jest.fn();
