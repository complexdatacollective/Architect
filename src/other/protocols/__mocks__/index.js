/* eslint-env jest */

export const importAssetToProtocol = jest.fn((protocolPath, filePath) => Promise.resolve(`${protocolPath}/${filePath}`));
export const saveProtocol = jest.fn(() => Promise.resolve());
export const exportProtocol = jest.fn();
export const createProtocol = jest.fn(() => Promise.resolve('/foo/new-protocol'));
export const locateProtocol = jest.fn(() => Promise.resolve('/foo/located-protocol'));
export const loadProtocolData = jest.fn(() => ({ foo: 'bar test protocol' }));

