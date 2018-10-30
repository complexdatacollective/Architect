/* eslint-disable no-console */

const showSaveDialog = (_, callback) => { callback('demo.netcanvas'); };
const showOpenDialog = (_, callback) => { callback(['demo.netcanvas']); };

const ipcRenderer = {
  on: (...args) => console.log('ipcRenderer.on', ...args),
  send: (...args) => console.log('ipcRenderer.send', ...args),
  removeListener: (...args) => console.log('ipcRenderer.removeListener', ...args),
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
    getGlobal: (...args) => console.log('remote.getGlobal', ...args),
  },
  ipcRenderer,
};
