/* eslint-disable no-console */

const showSaveDialog = (_, callback) => { callback('demo.netcanvas'); };
const showOpenDialog = (_, callback) => { callback('demo.netcanvas'); };

module.exports = {
  remote: {
    dialog: {
      showSaveDialog,
      showOpenDialog,
    },
    app: {
      getPath: () => '/tmp/foo/bar',
    },
  },
};
