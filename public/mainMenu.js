const { dialog } = require('electron');

const openDialogOptions = {
  buttonLabel: 'Open',
  nameFieldLabel: 'Open:',
  defaultPath: 'Protocol.netcanvas',
  filters: [{ name: 'Network Canvas', extensions: ['netcanvas'] }],
  properties: ['openFile'],
};

const openDialog = () =>
  new Promise((resolve, reject) => {
    dialog.showOpenDialog(openDialogOptions, (filename) => {
      if (filename === undefined) { reject(); return; }
      resolve(filename[0]);
    });
  });

const openFile = window =>
  () =>
    openDialog()
      .then(filePath => window.webContents.send('OPEN_FILE', filePath));


const MenuTemplate = window => ([
  {
    submenu: [
      { role: 'quit' },
    ],
  },
  {
    label: 'File',
    submenu: [
      {
        label: 'Import Protocol...',
        click: openFile(window),
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { type: 'separator' },
      { role: 'selectall' },
    ],
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
    ],
  },
  {
    role: 'window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' },
    ],
  },
]);

// if (process.platform !== 'darwin') {
//   // Get rid of the macOS primary menu
//   MenuTemplate.shift();
//   // Add those items elsewhere as appropriate
//   MenuTemplate[0].submenu.push({ type: 'separator' });
//   MenuTemplate[0].submenu.push({
//     label: 'Settings',
//     click: () => mainWindow.open('/settings'),
//   });
//   MenuTemplate[0].submenu.push({ type: 'separator' });
//   MenuTemplate[0].submenu.push({ role: 'quit' });
// }

module.exports = MenuTemplate;
