/* eslint-env jest */

const openProtocolDialog = jest.fn(() => Promise.resolve('/dev/null/fake/user/explored/path'));

export default openProtocolDialog;
