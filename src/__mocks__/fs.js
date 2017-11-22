/* eslint-env jest */

const writeFile = jest.fn((filename, content, cb) => cb());

export {
  writeFile,
};

export default {
  writeFile,
};
