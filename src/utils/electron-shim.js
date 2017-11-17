/* eslint-disable no-console */

module.exports = {
  remote: {
    dialog: {
      showSaveDialog: (_, callback) => { callback('demo.netcanvas'); },
    },
  },
};
