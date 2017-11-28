/* eslint-env jest */

const remote = {
  dialog: {
    showSaveDialog: jest.fn((options, cb) => cb('filename.canvas')),
  },
};

export {
  remote,
};

export default {
  remote,
};
