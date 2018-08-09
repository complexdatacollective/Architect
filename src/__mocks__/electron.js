/* eslint-env jest */

const remote = {
  dialog: {
    showSaveDialog: jest.fn((options, cb) => cb('filename.canvas')),
  },
  app: {
    getVersion: jest.fn(() => '0.0.0'),
  },
};

export {
  remote,
};

export default {
  remote,
};
