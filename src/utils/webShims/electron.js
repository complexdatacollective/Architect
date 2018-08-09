/* eslint-disable no-console */

const showSaveDialog = (_, callback) => { callback('demo.netcanvas'); };
const showOpenDialog = (_, callback) => { callback(['demo.netcanvas']); };
const ipcRenderer = {
  on: (...args) => console.log('ipcRenderer ON:', ...args),
  send: (...args) => console.log('ipcRenderer SEND', ...args),
};


module.exports = {
  remote: {
    dialog: {
      showSaveDialog,
      showOpenDialog,
    },
    app: {
      getPath: () => '/tmp/foo/bar',
      getVersion: () => 'x.x.x',
    },
  },
  ipcRenderer,
};
