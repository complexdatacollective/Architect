/* eslint-env jest */

// const openProtocolDialog = jest.fn(() => Promise.resolve('/dev/null/fake/user/explored/path'));
// const saveProtocolDialog = jest.fn(() => Promise.resolve('/dev/null/fake/user/save/path'));
const openDialog = jest.fn(() => Promise.resolve({ canceled: false, filePaths: ['/dev/null/fake/user/explored/path'] }));

export {
  // openProtocolDialog,
  // saveProtocolDialog,
  openDialog,
};
