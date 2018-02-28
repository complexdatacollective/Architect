/* eslint-disable no-console */

const showSaveDialog = (_, callback) => { callback('demo.canvas'); };
const showOpenDialog = (_, callback) => { callback('demo.canvas'); };

module.exports = {
  remote: {
    dialog: {
      showSaveDialog,
      showOpenDialog,
    },
  },
};
