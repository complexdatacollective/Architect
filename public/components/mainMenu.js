const { dialog, session } = require('electron');

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

const MenuTemplate = (window) => {
  const menu = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open...',
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
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Develop',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        {
          label: 'Clear storage data',
          click: () => {
            dialog.showMessageBox({
              message: 'This will reset all app data, are you sure?',
              buttons: ['OK', 'Cancel'],
            }, (response) => {
              if (response === 0) {
                window.webContents.session.clearStorageData();
                window.webContents.reload();
              }
            });
          },
        },
      ],
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' },
      ],
    },
  ];

  if (process.platform !== 'darwin') {
    // Get rid of the macOS primary menu
    menu[0].submenu.push({ role: 'quit' });
  } else {
    menu.unshift({
      submenu: [
        { role: 'quit' },
      ],
    });
  }

  return menu;
};

module.exports = MenuTemplate;
