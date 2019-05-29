const { dialog } = require('electron');
const updater = require('./updater');

const openDialogOptions = {
  buttonLabel: 'Open',
  nameFieldLabel: 'Open:',
  defaultPath: 'Protocol.netcanvas',
  filters: [{ name: 'Network Canvas', extensions: ['netcanvas'] }],
  properties: ['openFile'],
};

const saveDialogOptions = {
  buttonLabel: 'Save',
  nameFieldLabel: 'Save:',
  defaultPath: 'Protocol.netcanvas', // TODO: something based on existing filename?
  filters: [{ name: 'Network Canvas', extensions: ['netcanvas'] }],
};

const openDialog = () =>
  new Promise((resolve, reject) => {
    dialog.showOpenDialog(openDialogOptions, (filename) => {
      if (filename === undefined) { reject(); return; }
      resolve(filename[0]);
    });
  });

const openFile = appManager =>
  () =>
    openDialog()
      .then(filePath => appManager.openFile(filePath));

const saveDialog = () =>
  new Promise((resolve, reject) => {
    dialog.showSaveDialog(saveDialogOptions, (filename) => {
      if (filename === undefined) { reject(); return; }
      resolve(filename[0]);
    });
  });

const saveCopy = appManager =>
  () =>
    saveDialog()
      .then(filePath => appManager.saveCopy(filePath));

const MenuTemplate = (appManager) => {
  const menu = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open...',
          click: openFile(appManager),
        },
        {
          label: 'Save copy...',
          click: saveCopy(appManager),
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
                appManager.clearStorageData();
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

  const appMenu = [
    {
      label: 'Check for updates...',
      click: () => updater.checkForUpdates(),
    },
    { role: 'quit' },
  ];

  if (process.platform !== 'darwin') {
    // Use File> menu for Windows
    menu[0].submenu.concat(appMenu);
  } else {
    // Use "App" menu for OS X
    menu.unshift({
      submenu: appMenu,
    });
  }

  return menu;
};

module.exports = MenuTemplate;
