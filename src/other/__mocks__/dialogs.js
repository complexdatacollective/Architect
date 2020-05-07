/* eslint-env jest */

const openProtocolDialog = jest.fn(() => Promise.resolve('/dev/null/fake/user/explored/path'));
const saveProtocolDialog = jest.fn(() => Promise.resolve('/dev/null/fake/user/save/path'));

export {
  openProtocolDialog,
  saveProtocolDialog,
};
