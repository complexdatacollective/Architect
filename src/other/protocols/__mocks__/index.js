/* eslint-env jest */

export const importAssetToProtocol = jest.fn((protocolPath, filePath) => Promise.resolve(`${protocolPath}/${filePath}`));
export const saveProtocol = jest.fn(() => Promise.resolve('/dev/null/fake/user/protocol/path'));
export const locateProtocol = jest.fn(() => Promise.resolve('/dev/null/fake/user/explored/path'));
export const loadProtocolData = jest.fn(() => ({ foo: 'bar test protocol' }));
export const createProtocol = jest.fn(() => Promise.resolve('/dev/null/fake/user/entered/path'));
export const importProtocol = jest.fn(() => Promise.resolve('/dev/null/fake/working/path'));
export const exportProtocol = jest.fn(() => Promise.resolve('/dev/null/fake/working/path'));
