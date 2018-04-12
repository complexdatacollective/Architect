/* eslint-env jest */

export default jest.fn((protocolPath, filePath) => Promise.resolve(`${protocolPath}/${filePath}`));
